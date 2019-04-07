
$("#search-button").click(() => {
    let searchQuery = $('#search-input').val();
    initSearch(searchQuery);
});

function initSearch(searchQuery) {
    console.log('searched :', searchQuery);

    let searchService = new SearchService(searchQuery);

    searchService.init();
}

 function SearchService(searchQuery) {

    var info = {
        currentPageIndex: 0,
        numberOfPages: 0
    }    
    var searchText = searchQuery;

    this.init = async function(){
        console.log('inside init searchText:',searchText);
        const questions = await getStackOverflowResults(searchText);
        console.log('questions : ',questions);
    }
}

SearchService.prototype.onPrevious = function () {
    console.log('onPrevious');
}

SearchService.prototype.onNext = function () {
    console.log('onNext');
}

$("#previous-button").click(SearchService.prototype.onPrevious);
$("#next-button").click(SearchService.prototype.onNext);
