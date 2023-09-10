const puppeteer = require('puppeteer');
const path = require('path');

const sourceDir = path.join(__dirname, '../dist');

// Starts a browser with the extension loaded.
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${sourceDir}`,
            `--load-extension=${sourceDir}`,
        ],
    });
})();
