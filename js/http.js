/// contains function related to http apis

// var searchCriteria = {
//     maxResults:10,
//     minUpvotes:200,
//     showOnlyAcceptedAnswers:false
// }
const MIN_VOTES = 20;
const MAX_VOTES = 100000;
const PAGE_SIZE = 25;

const searchQueryParameters = {
    site:'stackoverflow',
    sort:'votes',
    min:MIN_VOTES,
    max:MAX_VOTES,
    pagesize:PAGE_SIZE,
    key:'',
    intitle:'how to create async function javascript'
}

const API_BASE = 'https://api.stackexchange.com/2.2/';

/// default configs for axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

 function getStackOverflowResults(searchCriteria){
    
    searchCriteria = searchCriteria || searchQueryParameters;

    //try{ 
        axios.get(API_BASE + 'search',{
            params:searchCriteria
        }).then(res=>{
            console.log('search res',res);
        }).catch(err=>{
            console.log('search err',err);
        });
    // }catch(e){
    //     return null;
    // }
}

function showQuotaError(){
    alert('stackOverflow daily API quota exceded.')
}

// /// setup response interseptor
// axios.interceptors.response.use(function (response) {
//     // show error message saying daily quota limit finisted.
//     console.log(response,'response')
//     if(response && response.quota_remaining === 0){
//         showQuotaError();
//         return null;
//     }
//     return response;
//   }, function (error) {
//     // Show error message.
//     return Promise.reject(error);
// });

getStackOverflowResults();