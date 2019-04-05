
$("#search-button").click(()=>{
    let searchQuery = $('#search-input').val();
    initSearch(searchQuery);
});

function initSearch(searchQuery){
    console.log('searched :',searchQuery);
    
    let searchService = new SearchService(searchQuery);

    $("#previous-button").click(searchService.onPrevious);
    $("#next-button").click(searchService.onNext);

}

function SearchService(searchQuery){

    this.currentPageIndex = 0;
    this.numberOfPages = 0;
    this.searchText = searchQuery;

    this.onPrevious = function (){
        console.log('onPrevious',this.searchText);
    }
    
    this.onNext = function(){
        console.log('onNext');
    }
}
