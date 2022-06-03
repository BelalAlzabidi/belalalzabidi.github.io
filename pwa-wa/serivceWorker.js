const CASH_NAME = "version-1"
const urlsToCash = [ 'index.html', 'offline.html']
const self = this;

// install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CASH_NAME)
            .then((cache) => {
                console.log('open cashes');
                return cache.addAll(urlsToCash);
            })
    )
});

//listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                // fetch again
                //eles means no internet then get the offline.html
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// activate the SW
self.addEventListener('activate', (event) => {
    const casheWhiteList = [];
    casheWhiteList.push(CASH_NAME);

    // delete any cash if its not in the white list which is the latest SW cash
    event.waitUntil(
        cashes.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!casheWhiteList.includes(cacheName)){
                    return cashes.delete(cacheName);
                }
            })
        ))
    );
});
