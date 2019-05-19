// Js code for setting_page.html to update custom settings

const elems = {};

function loadElements() {
    elems.maxQuestions = document.getElementById('maxQuestions');
    elems.maxAnswers = document.getElementById('maxAnswers');
    elems.maxVotes = document.getElementById('maxVotes');
    elems.minVotes = document.getElementById('minVotes');
    elems.apiKey = document.getElementById('apiKey');
    elems.isPopupMode = document.getElementById('isPopupMode');
    elems.updateButton = document.getElementById('update-button');
    elems.restoreButton = document.getElementById('restore-button');
}

async function loadSettings() {
    let customPref = await Preferences.getCustomSetting();
    if (customPref) {
        elems.maxQuestions.value = customPref.MAX_QUESTION_PER_SEARCH;
        elems.maxAnswers.value = customPref.MAX_ANSWER_PER_QUESTION;
        elems.minVotes.value = customPref.MIN_VOTES;
        elems.maxVotes.value = customPref.MAX_VOTES;
        elems.apiKey.value = customPref.API_KEY;
        elems.isPopupMode.checked = customPref.isOpenModePopUp;
    }
}

function setOpenMode(isPopup){

    if(isPopup === undefined) isPopup = false;

    if(isPopup === true){
        chrome.browserAction.setPopup({popup:'home.html'});
    }else{
        chrome.browserAction.setPopup({popup:''});
    }
}

function setupEventListeners() {
    elems.updateButton.onclick = function () {

        let newSetting = Object.assign({}, defaultSettings);

        newSetting.MAX_QUESTION_PER_SEARCH = elems.maxQuestions.value;
        newSetting.MAX_ANSWER_PER_QUESTION = elems.maxAnswers.value;
        newSetting.MIN_VOTES = elems.minVotes.value;
        newSetting.API_KEY = elems.apiKey.value;
        newSetting.isOpenModePopUp = elems.isPopupMode.checked;
        
        setOpenMode(elems.isPopupMode.checked);
        
        Preferences.set(Preferences.SETTING_KEY,newSetting);
   
        M.toast({ html: 'Settings updated.' });
    }

    elems.restoreButton.onclick = function () {
        Preferences.set(Preferences.SETTING_KEY);
        
        setOpenMode(true);
        
        M.toast({ html: 'Settings restored to default.' });
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    loadElements();
    setupEventListeners();

    await loadSettings();

    M.updateTextFields();
});