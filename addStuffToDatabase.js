const db = require("better-sqlite3")("QuizData.db");
const prompt = require('prompt-sync')();

const topic = prompt("Enter a topic: ");
const questionjson = JSON.parse(prompt("Enter the JSON array with the question data: "));

db.prepare("INSERT INTO QuizData VALUES (?, ?)").run(topic, JSON.stringify(questionjson));

console.log("Done diddly done");