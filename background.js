
console.log('background script running...')


async function setDefaultSetting() {
    // set default settting if its a first run...

    let existingSetting = await Preferences.get(Preferences.SETTING_KEY);
    console.log('existingSetting',existingSetting)
    if (existingSetting === undefined || existingSetting === null || Object.keys(existingSetting).length === 0 ) {
        Preferences.set(Preferences.SETTING_KEY);
    }
}

setDefaultSetting();