function doHttpGet(url, callback) {
   var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
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
        answers.push({question: index, answer: question.correct_answer});
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
        questionList.push(document.getElementById(`portfolioModal${i}${topic}`));
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
    var response = {topic: topic, score: 0, total: 0, results: []};
    var questionList = getQuestionList(topic);
    for (var i = 0; i < questionList.length; i++) {
        response.results.push({question: i, correct: questionList[i].classList.contains("correct")});
    }
    response.score = response.results.filter(r => r.correct).length;
    response.total = questionList.length;
    return response;
}

function submitAnswers(submitButton) {
    const topicName = submitButton.id.split("-")[1];
    if (!allQuestionsAreAnswered(topicName)) {
        window.alert("Go and answer the questions or Nat will be unhappy");
    } else {
        const score = getScore(topicName);
        window.alert(`You got ${score.score} out of ${score.total}`);
    }
}

function checkAnswer(button) {
    const buttonIdParts = button.id.split("-");
    const topic = buttonIdParts[0];
    const question = buttonIdParts[1];
    const answer = buttonIdParts[2];
    var image = document.getElementById(`image${question}${topic}`);
    var questionContainer = document.getElementById(`portfolioModal${question}${topic}`);
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

function addTopicToUi(topic) {
    doHttpGet(`/gettopic?topic=${encodeURIComponent(topic)}`, function(topic) {
        const topicData = topic[0];
        const topicName = topicData.topic;
        const questions = topicData.questions;

        addAnswerSheet(topicData);

        const navbarHtml = `
        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link js-scroll-trigger" href="#${topicName}">${topicName}</a>
        </li>
        `;

        document.getElementById("quiz-navbar").insertAdjacentHTML("afterbegin", navbarHtml);

        var portfolioHtml = `
        <section class="page-section portfolio" id="${topicName}">
            <div class="container">
                <!-- Portfolio Section Heading-->
                <div class="text-center">
                    <h2 class="page-section-heading text-secondary mb-0 d-inline-block">${topicName}</h2>
                </div>
                <!-- Icon Divider-->
                <div class="divider-custom">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                <!-- Portfolio Grid Items-->
                <div class="row justify-content-center">
                    <!-- Portfolio Items-->
        `

        for (var index = 0; index < questions.length; index++) {
            portfolioHtml += `
            <div class="col-md-6 col-lg-4 mb-5">
                <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#portfolioModal${index}${topicName}">
                <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content text-center text-white"><i"></i></div>
                </div>
                <h2 class="page-section-heading text-secondary mb-0 d-inline-block">Question ${index + 1}</h2>
                </div>
            </div>
            `
        }
        portfolioHtml += `
                </div>
            </div>
        </section>
        `;
        var modalHtml = "";
        for (var index = 0; index < questions.length; index++) {
            const question = questions[index];
            const questionText = question.question;
            const answers = question.answers;
            const image = "img/disappointed_dg.png";
            var modalButtons = ""
            for (var answerIndex = 0; answerIndex < answers.length; answerIndex++) {
                modalButtons += `
                <button id="${topicName}-${index}-${answerIndex + 1}" class="btn btn-primary" onclick=checkAnswer(this)>${answers[answerIndex]}</button>
                `
            }
            modalHtml += `
            <div class="portfolio-modal modal fade" id="portfolioModal${index}${topicName}" tabindex="-1" role="dialog" aria-labelledby="#portfolioModal${index}${topicName}Label" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fas fa-times"></i></span></button>
                        <div class="modal-body text-center">
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-lg-8">
                                        <!-- Portfolio Modal - Title-->
                                        <h2 class="portfolio-modal-title text-secondary mb-0">Question ${index + 1}</h2>
                                        <!-- Icon Divider-->
                                        <div class="divider-custom">
                                            <div class="divider-custom-line"></div>
                                            <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                                            <div class="divider-custom-line"></div>
                                        </div>
                                        <!-- Portfolio Modal - Image-->
                                        <img class="img-fluid rounded mb-5 hidden" alt="A lovely image goes here" id="image${index}${topicName}"/>
                                        <p class="mb-5" id="response${index}${topicName}"></p>
                                        <!-- Portfolio Modal - Text-->
                                        <p class="mb-5">${questionText}</p>
                                        <!-- Portfolio Modal - Buttons-->
                                        ${modalButtons}
                                        <!-- Portfolio Modal - Close Window-->
                                        <br></br>
                                        <div class="container">
                                            <button class="btn btn-danger" href="#" data-dismiss="modal"><i class="fas fa-times fa-fw"></i>Close Window</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        portfolioHtml += `
        <div class="container text-center">
            <button type="button" class="btn btn-success" onclick="submitAnswers(this)" id="submit-${topicName}">Submit</button>
        </div>
        `

        document.getElementById("quiz-container").insertAdjacentHTML("afterbegin", portfolioHtml);
        document.getElementById("quiz-container").insertAdjacentHTML("beforeend", modalHtml);
    });
}

doHttpGet("/gettopiclist", function(topicList) {
    for (topic of topicList) {
        addTopicToUi(topic.topic); //API returns JSON array...
    }
});
