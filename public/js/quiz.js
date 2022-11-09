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

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addTopicToUi(topic) {
    doHttpGet(`/gettopic?topic=${encodeURIComponent(topic)}`, function(topic) {
        const topicData = topic[0];
        const topicName = topicData.topic;
        const questions = topicData.questions;

        const navbarHtml = `
        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#${topicName}">${capitaliseFirstLetter(topicName)}</a>
        </li>
        `;

        document.getElementById("quiz-navbar").insertAdjacentHTML("afterbegin", navbarHtml);

        var portfolioHtml = `
        <section class="page-section portfolio" id="${topicName}">
            <div class="container">
                <!-- Portfolio Section Heading-->
                <div class="text-center">
                    <h2 class="page-section-heading text-secondary mb-0 d-inline-block">${capitaliseFirstLetter(topicName)}</h2>
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
                <div class="portfolio-item-caption-content text-center text-white"><i class="fas fa-plus fa-3x"></i></div>
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
                <button id="${answerIndex + 1}" class="btn btn-primary">${answers[answerIndex]}</button>
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
                                        <img class="img-fluid rounded mb-5" src="${image}" alt="A lovely image goes here" />
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

        document.getElementById("quiz-container").insertAdjacentHTML("afterbegin", portfolioHtml);
        document.getElementById("quiz-container").insertAdjacentHTML("beforeend", modalHtml);
    });
}

doHttpGet("/gettopiclist", function(topicList) {
    for (topic of topicList) {
        addTopicToUi(topic.topic); //API returns JSON array...
    }
});
