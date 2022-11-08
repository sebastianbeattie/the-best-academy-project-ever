const express = require('express');
const app = express();
const database = require("./database");

const port = 3000;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

app.get("/gettopiclist", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let topicData = database.getAllQuizTopics();
    res.end(JSON.stringify(topicData));
});

app.get("/gettopic", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let quizData = database.getAllQuizQuestionsForTopic(req.query.topic)
    res.end(JSON.stringify(quizData));
});

app.get("/getquiz", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let quizData = database.getAllQuizQuestions();
    res.end(JSON.stringify(quizData));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});