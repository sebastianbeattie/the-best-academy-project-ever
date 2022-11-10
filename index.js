const express = require('express');
const app = express();
const database = require("./database");
var morgan = require('morgan');

const port = 3000;

app.use(morgan("dev"));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

app.get("/leaderboard", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let resultsData = database.getLeaderboardForTopicAndDifficulty(req.query.topic, req.query.difficulty);
    res.end(JSON.stringify(resultsData));
});

app.get("/quizresult", (req, res) => {
    const results = JSON.parse(req.query.result);
    database.updateQuizResults(results);
    res.send(JSON.stringify({}));
});

app.get("/gettopiclist", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let topicData = database.getAllQuizTopics();
    res.end(JSON.stringify(topicData));
});

app.get("/gettopic", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let quizData = database.getAllQuizQuestionsForTopicAndDifficulty(req.query.topic, req.query.difficulty);
    database.addTopicVisitEvent(req.query.topic);
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