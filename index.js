const express = require('express');
const app = express();
const fs = require("fs");

const port = 3000;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

app.get("/getquiz", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(fs.readFileSync("myquizdata.json"));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});