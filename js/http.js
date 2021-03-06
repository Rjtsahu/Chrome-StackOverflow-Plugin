/// contains function related to http apis

const API_BASE = 'https://api.stackexchange.com/2.2/';

/// default configs for axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const MAX_QUESTION_PER_SEARCH = defaultSettings.MAX_QUESTION_PER_SEARCH;
const MAX_ANSWER_PER_QUESTION = defaultSettings.MAX_ANSWER_PER_QUESTION;

const MIN_VOTES = defaultSettings.MIN_VOTES;
const MAX_VOTES = defaultSettings.MAX_VOTES;
const API_KEY = defaultSettings.API_KEY;
const PAGE_SIZE = MAX_QUESTION_PER_SEARCH;

const searchQueryParameters = {
    site: 'stackoverflow',
    sort: 'relevance',
    pagesize: PAGE_SIZE,
    key: API_KEY,
    //  intitle: 'query string in url'
}

const parser = Parser();

async function getStackOverflowResults(searchQuery) {

    let customPref = await Preferences.getCustomSetting();
    if (customPref) {
        searchQueryParameters.pagesize = customPref.MAX_QUESTION_PER_SEARCH;
        searchQueryParameters.key = customPref.API_KEY;
    }

    let searchCriteria = Object.assign({}, searchQueryParameters);
    searchCriteria.q = searchQuery;

    let result = [];

    try {
        let searchRespoonse = await axios.get(API_BASE + 'search/advanced', { params: searchCriteria });

        searchRespoonse.data.items.forEach(question => {
            let questionObject = {
                title: question.title,
                link: question.link,
                question_id: question.question_id,
                answers: [],
                answer_fetched: false,
                inner_html: ''
            }

            result.push(questionObject);
        });
    } catch (e) {
        console.error('error in search api: ', e);
    } finally {
        return result;
    }
}

const questionQueryParameters = {
    site: 'stackoverflow',
    sort: 'votes',
    order: 'desc',
    min: MIN_VOTES,
    max: MAX_VOTES,
    key: ''
}

async function getAnswersForQuestion(question_id) {
    let max_answers = MAX_ANSWER_PER_QUESTION;

    let customPref = await Preferences.getCustomSetting();
    if (customPref) {
        questionQueryParameters.min = customPref.MIN_VOTES;
        questionQueryParameters.max = customPref.MAX_VOTES;
        questionQueryParameters.key = customPref.API_KEY;
        max_answers = customPref.MAX_ANSWER_PER_QUESTION;
    }


    let result = [];

    try {
        var response = await axios.get(API_BASE + 'questions/' + question_id + '/answers', {
            params: questionQueryParameters
        });

        max_answers = Math.min(response.data.items.length, max_answers);

        let answers = response.data.items.slice(0, max_answers);

        answers.forEach(answer => {
            let answerObject = {
                answer_id: answer.answer_id,
                score: answer.score,
                is_accepted: answer.is_accepted,
                inner_html: ''
            };

            result.push(answerObject);
        });

    } catch (e) {
        console.log('error in question api: ', e);
    } finally {
        return result;
    }
}

async function appendQuestionAndAnswerHTML(questionDetail) {
    let result = questionDetail || {};
    //  get top answers from api
    questionDetail.answers = await getAnswersForQuestion(questionDetail.question_id);
    // get html page from question link
    let { data } = await axios.get(questionDetail.link);
    questionDetail.inner_html = parser.getQuestionDivForQuestion(data);

    // append htmls for all answers
    questionDetail.answers.forEach(answer => {
        answer.inner_html = parser.getAnswerDivForQuestion(data, answer.answer_id);
    });

    return result;
}

function showQuotaError() {
    alert('stackOverflow daily API quota exceded.')
}

/// setup response interseptor
axios.interceptors.response.use(function (response) {
    // show error message saying daily quota limit finisted.
    if (response.data && response.data.quota_remaining === 0) {
        showQuotaError();
        return Promise.reject('daily api quota finished.');
    }
    return response;
}, function (error) {
    // Show error message.
    return Promise.reject(error);
});
