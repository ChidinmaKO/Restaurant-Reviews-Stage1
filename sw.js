const staticCacheName = 'restaurant-static-v1';

const cacheAssets = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/images/..'
];

// Call Install Event
self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open('staticCacheName')
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            // .then(() => self.skipWaiting())
            .catch(err => {
                console.log(`Error Caching Files: ${err}`);
            })
    );
});

/*
* Call Activate Event and clean up unwanted/old caches 
* and things associated with the old cache version which 
* is unused in the new version of the ServiceWorker
*/

self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // remove unwanted caches
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache.startsWith('restaurant-') && cache != staticCacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// Call Fetch Event
/**
 * A fetch event is fired when a resource is requested on the network. 
 */
self.addEventListener('fetch', e => {
    const requestUrl = new URL(e.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === 'index.html') {
        // required if files are in a different directory
        e.respondWith(caches.match('/'));
        return;
      }
    }
  
    /** 
     * use the Cache API to check if the request URL was already stored
     * in the cached responses, and return the cached response if this is the case.
     * Otherwise, it executes the fetch request and returns it 
     */ 
  
    e.respondWith(
    caches.match(e.request)
    .then( response => {
        if (response) {
            return response;
        } else {
            return fetch(e.request)
                .then(response => {
                    return caches.open('staticCacheName')
                        .then(cache => {
                            cache.put(e.requestUrl, response.clone());
                            return response;
                        })
                })
                .catch(err => {
                    return caches.open('staticCacheName')
                        .then(cache => {
                            return cache.match('/restaurant.html');
                        });
                });
        }
    })
);
});
  
self.addEventListener('message', e => {
    if (e.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});