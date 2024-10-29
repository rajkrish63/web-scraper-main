const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { URL } = require('url');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
async function downloadFile(url) {
    const response = await fetch(url);
    return await response.text();
}

async function fetchWithRetries(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) {
                throw error;
            }
            await new Promise(res => setTimeout(res, 2000)); 
        }
    }
}

app.post('/scrape', async (req, res) => {
    const { url, contentTypes } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const data = await fetchWithRetries(url);
        const $ = cheerio.load(data);
        const parsedUrl = new URL(url);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
        let results = {};

        if (contentTypes.includes('html')) {
            results.html = data;
        }
        if (contentTypes.includes('txt')) {
            const textContent = $('body').text().trim();
            results.text = textContent;
        }

        if (contentTypes.includes('css')) {
            const cssFiles = [];
            $('link[rel="stylesheet"]').each((index, element) => {
                const cssHref = $(element).attr('href');
                const cssUrl = new URL(cssHref, baseUrl).href;
                cssFiles.push(cssUrl);
            });

            results.css = await Promise.all(cssFiles.map(downloadFile));
        }

        if (contentTypes.includes('js')) {
            const jsFiles = [];
            $('script[src]').each((index, element) => {
                const jsSrc = $(element).attr('src');
                const jsUrl = new URL(jsSrc, baseUrl).href;
                jsFiles.push(jsUrl);
            });

            results.js = await Promise.all(jsFiles.map(downloadFile));
        }
        if (contentTypes.includes('img')) {
            const imgFiles = [];
            $('img').each((index, element) => {
                const imgSrc = $(element).attr('src');
                const imgUrl = new URL(imgSrc, baseUrl).href;
                imgFiles.push(imgUrl);
            });

            results.images = imgFiles;
        }

    
        if (contentTypes.includes('video')) {
            const videoFiles = [];
            $('video source').each((index, element) => {
                const videoSrc = $(element).attr('src');
                const videoUrl = new URL(videoSrc, baseUrl).href;
                videoFiles.push(videoUrl);
            });

            results.videos = videoFiles;
        }

        res.json({ message: 'Scraping complete!', results });
    } catch (error) {
        console.error('Error occurred during scraping:', error.message);
        res.status(500).json({ error: 'An error occurred during scraping' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
