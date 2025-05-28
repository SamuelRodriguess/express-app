let express = require('express');
let app = express();
const path = require('path');
require('dotenv').config()
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
    res.send('Hello Express');
})

app.get('/', (req, res) => {
    const absolutePath = __dirname + '/views/index.html'
    res.sendFile(absolutePath);
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.use("/public", express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    const absolutePath = __dirname + '/views/index.html'
    res.sendFile(absolutePath);
});

/* app.get('/json', (req, res) => {
    const data = {"message": "Hello json"}
    res.json(data)
}); */

app.get("/json", (req, res) => {
    const message =
        process.env["MESSAGE_STYLE"] === "uppercase"
            ? "Hello json".toUpperCase()
            : "Hello json";
    res.json({ message });
});

app.get('/user', function (req, res, next) {
    req.user = getTheUserSync();
    next();
}, function (req, res) {
    res.send(req.user);
});

app.get("/now", (req, res, next) => {
    const timeValue = new Date();
    req.time = timeValue;
    next();
}, (req, res, next) => {
    res.json({ time: req.time });
    next();
})

app.get("/:word/echo", (req, res, next) => {
    const { word } = req.params;

    if (!word) return

    res.json({
        echo: word
    });

    next()
});


app.get('/name', (req, res, next) => {
    const { first: firstName, last: lastName } = req.query ?? {}
    const nameFormatted = `${firstName} ${lastName}`

    if (typeof nameFormatted !== 'string' || nameFormatted.length === 0) {
        throw new Error('Invalid name: nameFormatted must be a non-empty string');
    }
    req.name = nameFormatted
    next()
}, (req, res, next) => {
    res.json({
        name: req.name
    });
    next();
})


app.post("/name", function (req, res) {
    const { first, last } = req.body ?? {}
    res.json({ name: `${first} ${last}` });
});

module.exports = app;
