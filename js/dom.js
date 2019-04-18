
let DomFactory = () => {

    this.showQuestionTitle = (title) => {
        let el = document.getElementById('question-title');
        el.innerText = title;
    }
    this.showQuestionContent = (questionObject)=>{
        document.getElementById('question-content').innerHTML = questionObject.inner_html;
    }

    this.toggleBlockVisibility = () => {
        $('#search-header').toggleClass('block-hidden');
        $('#content-after-search').toggleClass('block-hidden');
    }

    this.showAnswers = (answers) => {
        let answerListDiv = document.getElementById('answer-list');
       
        // delete all child element if any...
        while (answerListDiv.firstChild) {
            answerListDiv.removeChild(answerListDiv.firstChild);
        }
       
        answers.forEach(answerObject => {
            const content = prepareAnswerDiv(answerObject);
            answerListDiv.appendChild(content);
        });
        // set code heighlight using microlight
        document.querySelectorAll('pre code').forEach(e=>{e.setAttribute('class','microlight');});
        microlight.reset();
    }

    this.prepareAnswerDiv = (answerObject) => {
        let cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'card white-grey darken-1');

        let cardContentDiv = document.createElement('div');
        cardContentDiv.setAttribute('class', 'card-content black-text answer-content');
        cardDiv.appendChild(cardContentDiv);

        cardContentDiv.innerHTML = answerObject.inner_html;
        return cardDiv;
    }
    return {
        showQuestionTitle,
        showQuestionContent,
        showAnswers,
        toggleBlockVisibility
    }
}