/// contains function related to http apis

const API_BASE = 'https://api.stackexchange.com/2.2/';

/// default configs for axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

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
 //   min: MIN_VOTES,
 //   max: MAX_VOTES,
    pagesize: PAGE_SIZE,
    key: '',
    intitle: 'query string in url'
}

const parser = Parser();

async function getStackOverflowResults(searchQuery) {

    let searchCriteria = Object.assign({},searchQueryParameters);
    searchCriteria.intitle = searchQuery;

    let result = [];

    try {
        let searchRespoonse = await axios.get(API_BASE + 'search', { params: searchCriteria });

        searchRespoonse.data.items.forEach(question => {
            let questionObject = {
                title: question.title,
                link: question.link,
                question_id: question.question_id,
                answers: [],
                answer_fetched: false,
                inner_html:''
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
    key: ''
}

async function getAnswersForQuestion(question_id, max_answers) {
    max_answers = max_answers || MAX_ANSWER_PER_QUESTION;

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
            console.log('answerObj', answerObject);
        });

    } catch (e) {
        console.log('error in question api: ', e);
    }finally{
        return result;
    }
}

async function appendQuestionAndAnswerHTML(questionDetail){
    let result = questionDetail || {};
    //  get top answers from api
    questionDetail.answers = await getAnswersForQuestion(questionDetail.question_id);
    // get html page from question link
    let {data} = await axios.get(questionDetail.link);
    questionDetail.inner_html = parser.getQuestionDivForQuestion(data);
    
    // append htmls for all answers
    questionDetail.answers.forEach(answer=>{
        answer.inner_html = parser.getAnswerDivForQuestion(data,answer.answer_id);
    });

   return result;
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

// getAnswersForQuestion(54279317);

// getQuestionHTML();