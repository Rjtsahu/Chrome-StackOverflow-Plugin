
console.log('background script running...')

const HOME_PAGE = 'home.html';
const appId =  chrome.app.getDetails().id;

async function setDefaultSetting() {
    // set default settting if its a first run...

    let existingSetting = await Preferences.get(Preferences.SETTING_KEY);
    if (existingSetting === undefined || existingSetting === null || Object.keys(existingSetting).length === 0 ) {
        Preferences.set(Preferences.SETTING_KEY);
    }
}

function setOpenMode(isPopup){
    if(isPopup === undefined) isPopup = false;

    if(isPopup === true){
        chrome.browserAction.setPopup({popup:HOME_PAGE});
    }else{
        chrome.browserAction.setPopup({popup:''});
    }
}

chrome.browserAction.onClicked.addListener(function(activeTab){
var url = `chrome-extension://${appId}/${HOME_PAGE}`;
chrome.tabs.create({ url: url });
});

setDefaultSetting();