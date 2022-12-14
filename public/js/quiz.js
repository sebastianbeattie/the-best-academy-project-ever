function getUserId() {
    let userID = window.localStorage.getItem("userID");
    if (userID == undefined) {
        userID = "Anonymous";
        window.localStorage.setItem("userID", userID);
    }
    return userID;
}

function updateDifficulty(selector) {
    window.localStorage.setItem("difficulty", selector.value);
    let currentTopic = window.localStorage.getItem("currentTopic");
    if (currentTopic != undefined) addTopicToUi(currentTopic);
}

function getDifficulty() {
    let difficulty = window.localStorage.getItem("difficulty");
    if (difficulty == undefined) {
        difficulty = "beginner";
        window.localStorage.setItem("difficulty", difficulty);
    }
    return difficulty;
}

function showModal(title, content) {
    document.getElementById("modal-title").innerHTML = title;
    document.getElementById("modal-content").innerHTML = content;
    $('#modal').modal();
}

function generateLeaderboard(leaderboard) {
    var rows = "";

    for (row of leaderboard) {
        const name = row.userID;
        const score = row.score;
        rows += `
        <tr>
            <td>${name}</td>
            <td>${score}</td>
        </tr>
        `
    }

    var leaderboardHtml = `
    <center>
    <table id="quiz-leaderboard">
        <tr>
            <th>User</th>
            <th>Score</th>
        </tr>
        ${rows}
    </table>
    </center>
    `;
    return leaderboardHtml;
}

function doHttpGet(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function addAnswerSheet(topic) {
    var answers = [];

    for (var index = 0; index < topic.questions.length; index++) {
        var question = topic.questions[index];
        answers.push({ question: index, answer: question.correct_answer });
    }

    window.localStorage.setItem(topic.topic + "-answers", JSON.stringify(answers));
}

function confirmAnswer(topic, question, answer) {
    const answerSheet = JSON.parse(window.localStorage.getItem(topic + "-answers"));
    const questionFromStorage = answerSheet.find(q => q.question == question);
    return questionFromStorage.answer == answer;
}

function getQuestionCount(topic) {
    const answerSheet = JSON.parse(window.localStorage.getItem(topic + "-answers"));
    return answerSheet.length;
}

function getQuestionList(topic) {
    const questionCount = getQuestionCount(topic);
    var questionList = [];
    for (var i = 0; i < questionCount; i++) {
        questionList.push(document.getElementById(`questionContainer-${i}-${topic}`));
    }
    return questionList;
}

function allQuestionsAreAnswered(topic) {
    var questionList = getQuestionList(topic);
    var allAnswered = true;
    for (question of questionList) {
        if (!question.classList.contains("answered")) allAnswered = false;
    }
    return allAnswered;
}

function getScore(topic) {
    var response = { topic: topic, difficulty: getDifficulty(), score: 0, total: 0, userID: getUserId(), results: [] };
    var questionList = getQuestionList(topic);
    for (var i = 0; i < questionList.length; i++) {
        response.results.push({ question: i, correct: questionList[i].classList.contains("correct") });
    }
    response.score = response.results.filter(r => r.correct).length;
    response.total = questionList.length;
    return response;
}

function submitAnswers(submitButton) {
    const topicName = submitButton.id.split("-")[1];
    if (!allQuestionsAreAnswered(topicName)) {
        showModal("You need to finish the quiz first!", "Go and answer the questions or Nat will be unhappy");
    } else {
        const score = getScore(topicName);
        doHttpGet(`/quizresult?result=${encodeURIComponent(JSON.stringify(score))}`, function (response) {
            doHttpGet(`/leaderboard?topic=${topicName}&difficulty=${getDifficulty()}`, function (leaderboard) {
                var leaderboardHtml = generateLeaderboard(leaderboard);
                showModal("Quiz Results", `You got ${score.score} out of ${score.total}<br>${leaderboardHtml}`);
            });
        });
    }
}

function checkAnswer(buttonId) {
    const buttonIdParts = buttonId.split("-");
    const topic = buttonIdParts[0];
    const question = buttonIdParts[1];
    const answer = buttonIdParts[2];
    var image = document.getElementById(`image${question}${topic}`);
    var questionContainer = document.getElementById(`questionContainer-${question}-${topic}`);
    if (questionContainer.classList.contains("answered")) return;
    var response = document.getElementById(`response${question}${topic}`);
    if (confirmAnswer(topic, question, answer)) {
        image.src = "img/happy_dg.png";
        response.innerHTML = "You got it right! Super Groovy";
        questionContainer.classList.add("correct");
    } else {
        image.src = "img/disappointed_dg.png";
        response.innerHTML = "You got it wrong! Nat would like a word with you";
        questionContainer.classList.add("incorrect");
    }
    image.classList.remove("hidden");
    questionContainer.classList.add("answered");
}

function insertPortfolioAndModal(topicData) {
    document.title = "BBC quiz - " + topicData.topic;
    const topicName = topicData.topic;
    const questions = topicData.questions;
    addAnswerSheet(topicData);
    var portfolioHtml = "";

    for (var questionindex = 0; questionindex < questions.length; questionindex++) {
        var questionData = questions[questionindex];
        portfolioHtml += `
        <div class="container mb-5">
        <h2 class="page-section-heading text-secondary d-inline-block" id="questionContainer-${questionindex}-${topicName}">Question ${questionindex + 1}</h2>
        <div class="container">
        <img class="img-fluid rounded hidden" alt="A lovely image goes here" id="image${questionindex}${topicName}"/>
        <p class="main-text mb-0" id="response${questionindex}${topicName}"></p>
        </div>
        <p class="main-text">${questionData.question}</p>
        `;
        for (var answerIndex = 0; answerIndex < questionData.answers.length; answerIndex++) {
            portfolioHtml += `
            <button id="${topicName}-${questionindex}-${answerIndex + 1}" onclick=checkAnswer(this.id)>${questionData.answers[answerIndex]}</button>
            `
        }
        portfolioHtml += "</div>";
    }

    portfolioHtml += `
    <button type="button" onclick="submitAnswers(this)" id="submit-${topicName}" data-target="modal">Submit</button>
    `

    document.getElementById("the-content-zone").innerHTML = "";
    document.getElementById("the-content-zone").insertAdjacentHTML("afterbegin", portfolioHtml);
    window.scrollTo(0, 0);
}

function addTopicToNavBar(topic) {
    const navbarHtml = `
        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link" id="${topic.topic}" onclick="addTopicToUi(this.id)" href="#${topic.topic}">${topic.topic}</a>
        </li>
        `;
    document.getElementById("quiz-navbar").insertAdjacentHTML("afterbegin", navbarHtml);
    tileView(topic);
}

function tileView(topic) {
    const topicName = topic.topic
    const imageSrc = topic.image

    const tileHtml = `                
    <div class="col-md-4 col-lg-3 mb-5">
        <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#portfolioModal0">
            <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100" id="${topic.topic}" onclick="addTopicToUi(this.id)">
                <div class="portfolio-item-caption-content text-center text-white">${topicName}</i></div>
            </div><img class="img-fluid" src="${imageSrc}" alt="${topicName}"/>
        </div>
    </div>`

    document.getElementById("tileViewContainer").insertAdjacentHTML("afterbegin", tileHtml);
}

function addTopicToUi(topicName) {
    doHttpGet(`/gettopic?topic=${encodeURIComponent(topicName)}&difficulty=${encodeURIComponent(getDifficulty())}`, function (topics) {
        const topicData = topics[0];
        window.localStorage.setItem("currentTopic", topicName);
        insertPortfolioAndModal(topicData);
    });
}

document.getElementById("enter-nickname").addEventListener("keyup", (e) => {
    if (e.code == "Enter") {
        let nick = document.getElementById("enter-nickname").value.trim();
        if (nick == "" || nick == "Anonymous") {
            window.localStorage.setItem("userID", "Anonymous");
            showModal("Nickname Updated", "Your nickname has been removed and you are now an anonymous user");
        } else {
            window.localStorage.setItem("userID", nick);
            showModal("Nickname Updated", "Your nickname has been set to " + nick);
        }
    }
});

document.getElementById("enter-nickname").value = getUserId();

doHttpGet("/gettopiclist", function (topicList) {
    window.localStorage.removeItem("currentTopic");
    window.localStorage.setItem("difficulty", "beginner");
    for (topic of topicList) {
        addTopicToNavBar(topic); //API returns JSON array...
    }
});