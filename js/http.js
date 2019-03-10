/// contains function related to http apis

const MAX_QUESTION_PER_SEARCH = 5;
const MAX_ANSWER_PER_QUESTION = 3;
// including accepted answer or top 3 by votes

const MIN_VOTES = 2;
const MAX_VOTES = 100000;
const PAGE_SIZE = MAX_QUESTION_PER_SEARCH;

// show accepted + 2 answers in a question page

const searchQueryParameters = {
    site: 'stackoverflow',
    sort: 'votes',
    min: MIN_VOTES,
    max: MAX_VOTES,
    pagesize: PAGE_SIZE,
    key: '',
    intitle: 'query string in url'
}

const API_BASE = 'https://api.stackexchange.com/2.2/';

/// default configs for axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

async function getStackOverflowResults(searchCriteria) {

    searchCriteria = searchCriteria || searchQueryParameters;

    let result = [];

    try {
        let searchRespoonse = await axios.get(API_BASE + 'search', { params: searchCriteria });
        
        searchRespoonse.data.items.forEach(question => {
            let questionObject = {
                title: question.title,
                link: question.link,
                question_id: question.question_id,
                answer:[],
                answer_fetched:false
            }

            result.push(questionObject);
        });
    } catch (e) {
        console.error('error in search api: ',e);
    }finally{
        return result;
    }
}

function showQuotaError() {
    alert('stackOverflow daily API quota exceded.')
}

/// setup response interseptor
axios.interceptors.response.use(function (response) {
    // show error message saying daily quota limit finisted.
    console.log(response, 'response')
    if (response.data && response.data.quota_remaining === 0) {
        showQuotaError();
        return Promise.reject('daily api quota finished.');
    }
    return response;
}, function (error) {
    // Show error message.
    return Promise.reject(error);
});

getStackOverflowResults();