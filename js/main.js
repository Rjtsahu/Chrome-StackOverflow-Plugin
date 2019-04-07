
$("#search-button").click(() => {
    let searchQuery = $('#search-input').val();
    initSearch(searchQuery);
});

function initSearch(searchQuery) {
    console.log('searched :', searchQuery);

    let searchService = new SearchService(searchQuery);

    $("#previous-button").click(searchService.onPrevious);
    $("#next-button").click(searchService.onNext);

}

function SearchService(searchQuery) {

    var info = {
        currentPageIndex: 0,
        numberOfPages: 0
    }    
    var searchText = searchQuery;


}

SearchService.prototype.onPrevious = function () {
    console.log('onPrevious', this.searchText);
}

SearchService.prototype.onNext = function () {
    console.log('onNext');
}

