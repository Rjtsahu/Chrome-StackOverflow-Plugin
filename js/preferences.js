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
            chrome.storage.sync.get(key, (data) = accept(data));

            setTimeout(() => reject('storage time out.'), storageTimeout);
        });
    }
}
