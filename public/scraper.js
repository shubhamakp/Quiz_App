const puppeteer = require('puppeteer');
async function scrape(url) {
    console.log(url);
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(url);
    const scrapedData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.bix-td-qtxt'))
      .map(link => ({
        question: link.textContent,
      }))
  )
    console.log("hello");
    console.log(scrapedData);
    await browser.close()
   console.log("browser closed");
    return scrapedData;
}
module.exports.scrape = scrape;


    // console.log(data);
    // console.log("hello");
    // const fetch = require('node-fetch');
    // let body = { "title": "hi" };
    // fetch('http://localhost:3000/data', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(body),
    // }).then(response => {
    //         console.log(response)
    //         response.json()
    //     }).then(data => {
    //         console.log('Success:', data);
    //     }).catch((error) => {
    //         console.error('Error:', error);
    //     });