const express = require('express');
const request = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const port = 4000; // or any port you prefer

// Replace 'YOUR_SCRAPER_API_KEY' with your actual Scraper API key
const scraperApiKey = '17958b733f5957649afe5038821364e7';


app.get('/scrape', async (req, res) => {
    const url = 'https://topstartups.io/';

    try {
        const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&autoparse=true&url=${url}`;
        const response = await request(scraperUrl);

        // Implement your scraping logic here
        const startupNames = [];

        // Load the HTML content into Cheerio
        const $ = cheerio.load(response);

        // Modify this selector based on the actual structure of the page
        // This is a generic example and may not work for all cases
        $('h3 a').each((index, element) => {
            const name = $(element).text().trim();
            startupNames.push(name);
        });

        res.json({ startups: startupNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/scrape/local-file', (req, res) => {
    try {
        const filePath = 'startups_page1.html';  // Update the file name based on your project structure

        const startupNames = scrapeLocalFile(filePath);
        
        res.json({ startups: startupNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/scrape/local-file2', (req, res) => {
    try {
        const filePath = 'startups_page2.html';  // Update the file name based on your project structure

        const startupNames = scrapeLocalFile(filePath);
        
        res.json({ startups: startupNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function scrapeLocalFile(filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const startupNames = extractStartupNames(fileContents);
        return startupNames;
    } catch (error) {
        console.error('Error reading the local file:', error);
        return [];
    }
}

function extractStartupNames(htmlContent) {
    const startupNames = [];
    const $ = cheerio.load(htmlContent);

    // Modify this selector based on the actual structure of the page
    // This is a generic example and may not work for all cases
    $('.startup-selector h3').each((index, element) => {
        const name = $(element).text().trim();
        startupNames.push(name);
    });

    console.log('Extracted Names:', startupNames);  // Add this line for debugging

    return startupNames;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
