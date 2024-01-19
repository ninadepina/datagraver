import puppeteer from 'puppeteer';

const scrapeDestinations = async (url) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
        const items = document.querySelectorAll('table.infobox > tbody > tr > td > div > div > span:last-of-type');
        
        const itemTextArray = [];
        items.forEach((item) => {
            const text = item.textContent.trim();

            const modifiedText = text.replace(/ zetel(s)?/g, '');
            itemTextArray.push(modifiedText);
        });

        return itemTextArray;
    });

    await browser.close();

    return data;
};

const generateUrl = (year) => `https://nl.wikipedia.org/wiki/Tweede_Kamerverkiezingen_${year}`;

const years = [2023, 2021, 2017, 2012, 2010, 2006, 2003, 2002];

const scrapeAll = async () => {
    const results = {};

    for (const year of years) {
        const url = generateUrl(year);
        const result = await scrapeDestinations(url);
        results[year] = result;
    }

    return results;
};

scrapeAll().then((results) => {
    console.log(results);
});
