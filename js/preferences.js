// this file will use to store and retrive setting values.

const storageTimeout = 1000;

const storage = {
    set: async (data) => {
        return new Promise((accept, reject) => {
            chrome.storage.sync.set(data, () => accept());

            setTimeout(() => reject('storage time out.'), storageTimeout);
        });
    },
    get: async (key) => {
        return new Promise((accept, reject) => {
            chrome.storage.sync.get(key, (data) => accept(data));

            setTimeout(() => reject('storage time out.'), storageTimeout);
        });
    }
}

const defaultSettings = {
    MAX_QUESTION_PER_SEARCH: 5,
    MAX_ANSWER_PER_QUESTION: 3,
    MIN_VOTES: 2,
    MAX_VOTES: 10000,
    API_KEY: '',
    isOpenModePopUp: true
}

const Preferences = {
    SETTING_KEY: 'customSetting',
    AUTOCOMPLETE_KEY: 'autoCompleteList',
    set: async (key, pref) => {
        pref = pref || defaultSettings;
        await storage.set({ [key]: pref });
    },
    get: async (key) => {
        return await storage.get(key);
    },
    getCustomSetting: async (key) => {
        let obj = await storage.get(key);
        return obj[Preferences.SETTING_KEY];
    },
    getAutoCompleteItems: async ()=>{
        let exisitingItems = await storage.get(Preferences.AUTOCOMPLETE_KEY);
        return exisitingItems[Preferences.AUTOCOMPLETE_KEY] || [];
    },
    addAutoCompleteItem: async (item) => {
        let exisitingItems = await Preferences.getAutoCompleteItems();
        
        if (exisitingItems.length > 0) {
            let alreadyExists = false;

            exisitingItems.forEach(exisitingItem => {
                if (item === exisitingItem) {
                    alreadyExists = true;
                }
            });

            if (!alreadyExists) {
                exisitingItems.push(item);
                await storage.set({ [Preferences.AUTOCOMPLETE_KEY]: exisitingItems })
            }
        }else{
            await storage.set({ [Preferences.AUTOCOMPLETE_KEY]: [item] })
        }
    }
}