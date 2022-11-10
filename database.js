const db = require("better-sqlite3")("QuizData.db");

//Quiz queries
const CREATE_QUIZ_SCHEMA = "CREATE TABLE IF NOT EXISTS QuizData (topic TEXT, image TEXT, questions TEXT)";
const GET_QUESTIONS_FOR_TOPIC = "SELECT * FROM QuizData WHERE LOWER(topic) = LOWER(?)";
const GET_ALL_QUIZ_QUESTIONS = "SELECT * FROM QuizData";
const GET_ALL_QUIZ_TOPICS_AND_IMAGES = "SELECT topic, image FROM QuizData";

//Time metrics queries
const CREATE_TIME_METRICS_SCHEMA = "CREATE TABLE IF NOT EXISTS TimeMetrics (topic TEXT, dateTime TEXT)";
const INSERT_TIME_METRIC = "INSERT INTO TimeMetrics VALUES (?, ?)";

//SELECT topic, COUNT(*) FROM TimeMetrics GROUP BY topic ORDER BY COUNT(*) DESC

//Result Metrics queries
const CREATE_RESULT_METRICS_SCHEMA = "CREATE TABLE IF NOT EXISTS ResultMetrics (topic TEXT, difficulty TEXT, question TEXT, userID TEXT, correctOrNot BOOL, mostRecent BOOl)"
const INVALIDATE_PREVIOUS_ATTEMPTS = "UPDATE ResultMetrics SET mostRecent = false WHERE userID = ? AND topic = ?";
const INSERT_NEW_ATTEMPT = "INSERT INTO ResultMetrics VALUES(?, ?, ?, ?, ?, ?)";
const GET_LEADERBOARD_FOR_TOPIC_AND_DIFFICULTY = "SELECT topic, userID, difficulty, COUNT(*) FROM ResultMetrics WHERE correctOrNot = true AND LOWER(topic) = LOWER(?) AND difficulty = ? GROUP BY userID, topic, difficulty ORDER BY COUNT(*) DESC";

//Create Tables
db.exec(CREATE_QUIZ_SCHEMA);
db.exec(CREATE_TIME_METRICS_SCHEMA);
db.exec(CREATE_RESULT_METRICS_SCHEMA);

function boolToInt(bool) {
    return bool ? 1 : 0;
}

function updateQuizResults(results) {
    db.prepare(INVALIDATE_PREVIOUS_ATTEMPTS).run(results.userID, results.topic);

    for (result of results.results) {
        db.prepare(INSERT_NEW_ATTEMPT).run(results.topic, results.difficulty, result.question.toString(), results.userID, boolToInt(result.correct), boolToInt(true));
    }
}

function addTopicVisitEvent(topic) {
    const dateTime = new Date().toISOString();
    db.prepare(INSERT_TIME_METRIC).run(topic, dateTime);
}

function getAllQuizQuestionsForTopicAndDifficulty(topic, difficulty) {
    if (difficulty == undefined) difficulty = "beginner";
    let data = db.prepare(GET_QUESTIONS_FOR_TOPIC).all(topic);
    for (var i = 0; i < data.length; i++) {
        let qData = JSON.parse(data[i].questions);
        data[i].questions = qData.filter(q => q.difficulty == difficulty);
    }
    return data;
}

function getAllQuizQuestions() {
    let data = db.prepare(GET_ALL_QUIZ_QUESTIONS).all();
    for (var i = 0; i < data.length; i++) {
        data[i].questions = JSON.parse(data[i].questions);
    }
    return data;
}

function getAllQuizTopics() {
    return db.prepare(GET_ALL_QUIZ_TOPICS_AND_IMAGES).all();
}

function getLeaderboardForTopicAndDifficulty(topic, difficulty) {
    var leaderboard = db.prepare(GET_LEADERBOARD_FOR_TOPIC_AND_DIFFICULTY).all(topic, difficulty);
    for (leaderboardRow of leaderboard) {
        leaderboardRow.score = leaderboardRow["COUNT(*)"];
        delete leaderboardRow["COUNT(*)"];
    }
    return leaderboard;
}

module.exports = {
    getAllQuizQuestionsForTopicAndDifficulty,
    getAllQuizQuestions,
    getAllQuizTopics,
    addTopicVisitEvent,
    updateQuizResults,
    getLeaderboardForTopicAndDifficulty,
    boolToInt
};