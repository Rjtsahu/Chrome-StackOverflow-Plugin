
$("#search-button").click(() => {
    let searchQuery = $('#search-input').val();
    if (searchQuery === '') return;

    initSearch(searchQuery);
});

let searchService;
const domFactory = DomFactory();

function initSearch(searchQuery) {
    console.log('searched :', searchQuery);

    searchService = new SearchService(searchQuery);

    searchService.init();
}

function SearchService(searchQuery) {

    const info = {
        currentPageIndex: 0,
        currentQuestionIndex: 0,
        numberOfPages: 0
    }
    const searchText = searchQuery;
    let results = []

    this.init = async function () {
        console.log('inside init searchText:', searchText);
        const questions = await getStackOverflowResults(searchText);
        console.log('questions : ', questions);

        results = Object.assign([], questions);

        info.currentPageIndex = 0;
        info.numberOfPages = results.length;

        if (results.length === 0) {
            console.log('no result ...');
            M.toast({ html: 'No Search result...' });
        } else {
            document.getElementById('search-query').innerText = 'Result for ' + searchText;
            // display answer div and hide search div
            domFactory.toggleBlockVisibility();
            domFactory.showQuestionCollapsible(questions);
        }
    }

    this.showPageResult = async (data) => {
        console.log('result data: ', data);
        domFactory.showQuestionTitle(data.title);
        // get question details including html content of question and associated answers.
        if (data.answer_fetched === false) {
            let questionDetail = await appendQuestionAndAnswerHTML(data);
            data = questionDetail;
            questionDetail.answer_fetched = true;
            results[info.currentPageIndex] = questionDetail;
        }
        domFactory.showQuestionContent(data);
        domFactory.showAnswers(data.answers);
    }

    this.showQuestionContent = async (elementId, questionId) => {
        let index = this.findIndexByQuestionId(questionId);
        info.currentQuestionIndex = index;

        let data = results[index];

        // get question details including html content of question and associated answers.
        if (data.answer_fetched === false) {
            let questionDetail = await appendQuestionAndAnswerHTML(data);
            data = questionDetail;
            questionDetail.answer_fetched = true;
            results[index] = questionDetail;

           domFactory.showCollapsibleItem(data, elementId);
        }

    }

    this.findIndexByQuestionId = (questionId) => {

        for (var i = 0; i < results.length; i++) {
            if (results[i].question_id === questionId) {
                return i;
            }
        }
        return -1;
    }
}


// init collapsible 
document.addEventListener('DOMContentLoaded', function () {

    /// setup event handler
    let options = {
        onOpenStart: (el) => {
            console.log('onOpenStart');
            let elementId = el.getElementsByClassName('collapsible-item-content')[0].getAttribute('id');
            let questionId = parseInt(elementId.split('-')[1]);
            searchService && searchService.showQuestionContent(elementId, questionId);
        },
        onCloseStart: (el) => {
            console.log('onCloseStart');
        }
    }

    let elem = document.querySelector('.collapsible');
    M.Collapsible.init(elem, options);

});

