const db = require("better-sqlite3")("QuizData.db");
const { quiz } = require("./myquizdata.json");

db.exec("DELETE FROM QuizData");

for (topic of quiz) {
    db.prepare("INSERT INTO QuizData VALUES (?, ?)").run(topic.topic, JSON.stringify(topic.quizquestions));
    console.log(`Added topic ${topic.topic}`);
}

console.log("Done diddly done");