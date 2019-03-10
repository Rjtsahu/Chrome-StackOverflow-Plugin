/// code for HTML parser

Parser = () => {

    this.domParser = new DOMParser();

    /** 
     * This function will return DOM object parsed from input HTML string.
    */
    this.getDocument = (htmlContent) => {
        return this.domParser.parseFromString(htmlContent, "text/html");
    }

    /**
     *  This function will return HTML div element representing content of answer in
     * SO question page.
     * */
    this.getAnswerDivForQuestion = function (htmlContent, answerId) {
        try {
            let document = this.getDocument(htmlContent);

            return document.getElementById('answer-' + answerId).
                getElementsByClassName('post-text')[0].innerHTML;

        } catch (e) {
            console.error('error in parsing answer: ', e);
            return "";
        }
    }

    /**
     *  This function will return HTML div element representing content of question in
     * SO question page.
     * */
    this.getQuestionDivForQuestion = function (htmlContent) {
        try {
            let document = this.getDocument(htmlContent);

            return document.getElementById('question').
                getElementsByClassName('post-text')[0].innerHTML;

        } catch (e) {
            console.error('error in parsing question: ', e);
            return "";
        }
    }

    return {
        getDocument: getDocument,
        getAnswerDivForQuestion: getAnswerDivForQuestion,
        getQuestionDivForQuestion: getQuestionDivForQuestion
    }
}