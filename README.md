# web-scraper-main
A Node.js web scraper application that extracts HTML, CSS, JavaScript, text, images, and videos from specified URLs. Offers an interactive UI to display and download scraped content.

###
# Web Scraper Application

A powerful Node.js web scraper that allows users to extract and interact with HTML, CSS, JavaScript, text, images, and video content from any public web page. The application features a clean, user-friendly UI for viewing and downloading the extracted content directly.

## Features
- **Extract Content by Type**: Choose between HTML, JavaScript, text, images, and video content types.
- **Preview and Download**: View scraped content in the browser and download it as files.
- **Retry Mechanism**: Automatically retries requests for improved stability.
- **Clean Interface**: Simple, user-friendly UI.

## Installation

1. open cmd redirect to web-scraper
   cd web-scraper
2. Install Dependencies
Install the necessary packages by running:
  npm install
3. Run the Server
Start the application server:
  npm start
4. Open the Application
Open your browser and go to: http://localhost:3000

Usage
Enter a URL: Input the URL of the webpage you want to scrape.
Choose Content Type: Select the type of content you wish to extract (HTML, JavaScript, text, images, or video).
View and Download: Scraped content will display in the interface with a download option for each type.



web-scraper/
├── public/
│   └── index.html       # Main HTML file
├── scraper.js          # Main server and scraper logic
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation

--- 

This **README** provides a full overview, clear installation instructions, and a structured outline for usage, making it easy for users and collaborators to understand and work with the project.
