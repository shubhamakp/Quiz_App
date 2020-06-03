const express = require('express');
const app = express();
var PORT = process.env.PORT||3000;
const path = require('path');
const bodyparser = require('body-parser');
const puppeteer = require('puppeteer');
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
var session = require('express-session');
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
    var message = req.session.message || "nothing";
    console.log(message);
    res.render('index', { message: message })
})

app.post('/question', (req, res, next) => {

    let date = req.body.date;
    console.log(date);
   
    var yg = parseInt(date.substring(0, 4));
    var mg = parseInt(date.substring(5, 7));
    var dg = parseInt(date.substring(8, 10));
    console.log(yg,mg,dg)

    var d = new Date();
    var da = d.getDate();
    var m = d.getMonth()+1;
    var y = d.getFullYear();
    console.log(da,m,y);
    
    const oneDay = 86400000; // hours*minutes*seconds*milliseconds
    const StartDate = new Date(y, m, da);
    const EndDate = new Date(yg, mg, dg);
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
    let diffDays = Math.round(((start - end) / oneDay));
    if(date==='')
    diffDays=35;
    console.log(diffDays)
    if (diffDays > 30||diffDays<=0) {
        if(date==='')
        req.session.message='please enter a date first'
        else
        req.session.message = "Enter the date within a month";
        res.redirect('/')
    } else {
        let url1 = 'https://www.indiabix.com/current-affairs/' + date + '/';
        console.log(url1);
        (async () => {
            headless = true;
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '–disable-setuid-sandbox'],
                
            });

            try {
                const page = await browser.newPage();
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
                e.message = "error";
                res.status(error.response.status)
                return res.send("hi");
                // console.log(e);
            } finally {
                await browser.close();
            }
        })()
        .then(obj => {
            console.log(obj)
        })
        .catch(err =>{
            console.log(err)
        });
    }
});

app.listen(PORT);
