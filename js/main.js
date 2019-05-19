
$("#search-button").click(() => {
    let searchQuery = $('#search-input').val();
    if (searchQuery === '') return;

    initSearch(searchQuery);
});

let searchService;
const domFactory = DomFactory();
const appId =  chrome.app.getDetails().id;

async function initSearch(searchQuery) {

    searchService = new SearchService(searchQuery);

    domFactory.showLoader();

    Preferences.addAutoCompleteItem(searchQuery);
    await searchService.init();

    domFactory.hideLoader();

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
        const questions = await getStackOverflowResults(searchText);
        results = Object.assign([], questions);

        info.currentPageIndex = 0;
        info.numberOfPages = results.length;

        if (results.length === 0) {
            M.toast({ html: 'No Search result...' });
        } else {
            document.getElementById('search-query').innerText = 'Result for ' + searchText;
            // display answer div and hide search div
            domFactory.toggleBlockVisibility();
            domFactory.showQuestionCollapsible(questions);
        }
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
document.addEventListener('DOMContentLoaded', async function () {

    /// setup event handler
    let options = {
        onOpenStart: async (el) => {
            domFactory.showLoader();
            let elementId = el.getElementsByClassName('collapsible-item-content')[0].getAttribute('id');
            let questionId = parseInt(elementId.split('-')[1]);
            if (searchService) {
                await searchService.showQuestionContent(elementId, questionId);
            }
            domFactory.hideLoader();
        }
    }

    let elem = document.querySelector('.collapsible');
    M.Collapsible.init(elem, options);

    let fabElem = document.querySelector('.fixed-action-btn');
    M.FloatingActionButton.init(fabElem, {
        direction: 'left',
        hoverEnabled: true
    });

    /// initialization for autocomplete

    let autocompleteElem = document.querySelector('.autocomplete');
    let autoCompleteOptions = { limit: 3 };
    M.Autocomplete.init(autocompleteElem, autoCompleteOptions);
    updateAutoCompleteData();

    /// initialization for bookmark modal popup
    let modalOptions = {
        onOpenStart : async ()=>{
            let searchedTerms = await Preferences.getAutoCompleteItems();
            searchedTerms = searchedTerms.reverse();
            domFactory.showRecentSearchItems(searchedTerms);
        }
    }
    let modalElem = document.getElementById('modal-recent-search');
    M.Modal.init(modalElem,modalOptions);


});

/// action for fab buttons
$("#button-back").click(() => {
    if (searchService) {
        domFactory.toggleBlockVisibility();
        domFactory.removeCollapsibleContent();
        updateAutoCompleteData();
        searchService = undefined;
    }
});

async function updateAutoCompleteData() {
    let elem = document.querySelector('.autocomplete');
    let instance = M.Autocomplete.getInstance(elem);
    let autoCompleteData = {};
    let autoCompleteItems = await Preferences.getAutoCompleteItems();

    autoCompleteItems.forEach(item => {
        autoCompleteData[item] = null;
    });

    instance.updateData(autoCompleteData);
}

$('#button-setting').click(()=>{
    /// setup setting page link
    let url = `chrome-extension://${appId}/setting_page.html`;
    chrome.tabs.create({ url: url });
});