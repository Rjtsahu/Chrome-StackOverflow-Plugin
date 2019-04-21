
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

    let info = {
        currentPageIndex: 0,
        numberOfPages: 0
    }
    let searchText = searchQuery;
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
            M.toast({html:'No Search result...'});

            // show toast error.
        } else {
            document.getElementById('search-query').innerText = 'Result for ' + searchText;
            this.showPageResult(questions[0]);
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

    this.showNextPage = async () => {
        let currentIndex = info.currentPageIndex;
        if (currentIndex >= info.numberOfPages - 1) {
            console.log('no more next pages...');
            return;
        }

        let data = results[currentIndex + 1];
        this.showPageResult(data);

        info.currentPageIndex += 1;
    }

    this.showPreviousPage = async () => {
        let currentIndex = info.currentPageIndex;
        if (currentIndex <= 0) {
            console.log('no more previous pages...');
            return;
        }

        let data = results[currentIndex - 1];
        this.showPageResult(data)

        info.currentPageIndex -= 1;
    }
}

SearchService.prototype.onPrevious = function () {
    console.log('onPrevious');
    if (searchService) {
        searchService.showPreviousPage();
    }
}

SearchService.prototype.onNext = function () {
    console.log('onNext');
    if (searchService) {
        searchService.showNextPage();
    }
}

$("#previous-button").click(SearchService.prototype.onPrevious);
$("#next-button").click(SearchService.prototype.onNext);
