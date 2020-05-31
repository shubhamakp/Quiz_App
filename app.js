const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const puppeteer = require('puppeteer');
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

app.post('/question', (req, res, next) => {

    let date = req.body.date;
    console.log(date);
    var yg = date.substring(0, 4);
    var mg = date.substring(5, 7);
    var dg = date.substring(8, 10);

    var d = new Date();
    var da = d.getDate();
    var m = d.getMonth();
    var y = d.getFullYear();
    console.log(da);
    console.log(m);
    console.log(y);

    if (y - yg != 0 || mg > m || m - mg > 6 || dg > da) {
        res.redirect('/')
    } else {
        let url1 = 'https://www.indiabix.com/current-affairs/' + date + '/';
        console.log(url1);
        (async () => {
            headless = true;
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            });

            try {
                const page = await browser.newPage();
                // url = 'https://www.indiabix.com/current-affairs/2020-04-02/';
                url = url1;
                await page.goto(url, { waitUntil: 'load', timeout: 0 });
                const scrapedData = await page.evaluate(() =>
                    Array.from(document.querySelectorAll('.bix-td-qtxt'))
                        .map(link => ({
                            question: link.textContent,
                        }))
                )

                const ans = await page.evaluate(() =>
                    Array.from(document.querySelectorAll('.bix-td-option'))
                        .map(link => ({
                            answer: link.textContent,
                        }))
                )

                const corrans = await page.evaluate(() =>
                    Array.from(document.querySelectorAll('span.jq-hdnakqb'))
                        .map(link => ({
                            corranswer: link.textContent,
                        }))
                )

                var obj = {};
                for (var i = 0; i < scrapedData.length; i++) {
                    var key = 'question' + i + '';
                    obj[key] = scrapedData[i].question;
                }

                var ansobj = {};
                for (var i = 0; i < ans.length; i++) {
                    var key = 'ans' + i + '';
                    ansobj[key] = ans[i].answer;
                }

                var corransobj = {};
                for (var i = 0; i < corrans.length; i++) {
                    var key = 'ans' + i + '';
                    corransobj[key] = corrans[i].corranswer;
                }

                console.log("hoil")
                console.log("hi");

                res.render('questions', { obj: obj, ansobj: ansobj, corransobj: corransobj });

            } catch (e) {
                console.log(e);
            } finally {
                await browser.close();
            }
        })();
    }
});

app.listen(3000);
