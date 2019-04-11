
$("#search-button").click(() => {
    let searchQuery = $('#search-input').val();
    initSearch(searchQuery);
});

let searchService;

function initSearch(searchQuery) {
    console.log('searched :', searchQuery);

    searchService = new SearchService(searchQuery);

    searchService.init();
}

function SearchService(searchQuery) {

    var info = {
        currentPageIndex: 0,
        numberOfPages: 0
    }
    var searchText = searchQuery;
    var results = []

    this.init = async function () {
        console.log('inside init searchText:', searchText);
        const questions = await getStackOverflowResults(searchText);
        console.log('questions : ', questions);

        results = Object.assign({}, questions);

        info.currentPageIndex = 0;
        info.numberOfPages = results.length;

        showQuestion(questions[0]);
    }

    this.showPageResult = async (data) => {

    }

    this.showNextPage = async () => {

    }

    this.showPreviousPage = async () => {

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
