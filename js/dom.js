
let DomFactory = () => {

    this.showQuestionTitle = (title) => {
        let el = document.getElementById('question-title');
        el.innerText = title;
    }
    return {
        showQuestionTitle
    }
}