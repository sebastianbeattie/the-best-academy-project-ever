const db = require("better-sqlite3")("QuizData.db");

const CREATE_QUIZ_SCHEMA = "CREATE TABLE IF NOT EXISTS QuizData (topic TEXT, questions TEXT)";
const GET_QUESTIONS_FOR_TOPIC = "SELECT * FROM QuizData WHERE topic = ?";
const GET_ALL_QUIZ_QUESTIONS = "SELECT * FROM QuizData";
const GET_ALL_QUIZ_TOPICS = "SELECT topic FROM QuizData";

db.exec(CREATE_QUIZ_SCHEMA);

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

module.exports = {getAllQuizQuestionsForTopic, getAllQuizQuestions, getAllQuizTopics};