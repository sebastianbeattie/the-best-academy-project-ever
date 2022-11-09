const db = require("better-sqlite3")("QuizData.db");

//Quiz queries
const CREATE_QUIZ_SCHEMA = "CREATE TABLE IF NOT EXISTS QuizData (topic TEXT, questions TEXT)";
const GET_QUESTIONS_FOR_TOPIC = "SELECT * FROM QuizData WHERE LOWER(topic) = LOWER(?)";
const GET_ALL_QUIZ_QUESTIONS = "SELECT * FROM QuizData";
const GET_ALL_QUIZ_TOPICS = "SELECT topic FROM QuizData";

//Time metrics queries
const CREATE_TIME_METRICS_SCHEMA = "CREATE TABLE IF NOT EXISTS TimeMetrics (topic TEXT, dateTime TEXT)";
const INSERT_TIME_METRIC = "INSERT INTO TimeMetrics VALUES (?, ?)";

//Result Metrics queries
const CREATE_RESULT_METRICS_SCHEMA = "CREATE TABLE IF NOT EXISTS ResultMetrics (topic TEXT, question TEXT, userID TEXT, correctOrNot BOOL, mostRecent BOOl)"
const GET_NUMBER_OF_CORRECT_ANSWERS_FOR_QUESTION = "SELECT COUNT(*) FROM ResultMetrics WHERE topic = ? AND question = ? AND mostRecent = true";
const GET_OVERALL_RESULTS_FOR_TOPIC_ANONYMOUS = "SELECT topic, COUNT(*) FROM ResultMetrics WHERE correctOrNot = true AND mostRecent = true GROUP BY userID";
const INVALIDATE_PREVIOUS_ATTEMPTS = "UPDATE ResultMetrics SET mostRecent = false WHERE userID = ? AND topic = ?";
const INSERT_NEW_ATTEMPT = "INSERT INTO ResultMetrics VALUES(?, ?, ?, ?, ?)";

db.exec(CREATE_QUIZ_SCHEMA);
db.exec(CREATE_TIME_METRICS_SCHEMA);
db.exec(CREATE_RESULT_METRICS_SCHEMA);

function addTopicVisitEvent(topic) {
    const dateTime = new Date().toISOString();
    db.prepare(INSERT_TIME_METRIC).run(topic, dateTime);
}

function getAllQuizQuestionsForTopic(topic) {
    let data = db.prepare(GET_QUESTIONS_FOR_TOPIC).all(topic);
    for (var i = 0; i < data.length; i++) {
        data[i].questions = JSON.parse(data[i].questions);
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
    return db.prepare(GET_ALL_QUIZ_TOPICS).all();
}

module.exports = {getAllQuizQuestionsForTopic, getAllQuizQuestions, getAllQuizTopics, addTopicVisitEvent};