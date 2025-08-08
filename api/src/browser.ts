import puppeteer, { Browser } from 'puppeteer';

let browser: Browser;
let browserProm: Promise<Browser>;

export const getBrowser = async () => {
    if(browser) {
        return browser;
    }
    else if(browserProm) {
        await browserProm;
        return browser;
    }
    
    browserProm = puppeteer.launch({
        headless: true
    });
    browser = await browserProm;
    return browser;
};