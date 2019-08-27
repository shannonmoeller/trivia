// HTML files: try the network first, then the cache.
// Other files: try the cache first, then the network.
// Both: cache a fresh version if possible.
// (beware: the cache will grow and grow; there's no cleanup)

const cacheName = 'trivia-v1';

addEventListener('fetch', (fetchEvent) => {
	const request = fetchEvent.request;
	if (request.method !== 'GET') {
		return;
	}
	fetchEvent.respondWith(
		(async function() {
			const responseFromFetch = fetch(request);
			fetchEvent.waitUntil(
				(async function() {
					const responseCopy = (await responseFromFetch).clone();
					const myCache = await caches.open(cacheName);
					await myCache.put(request, responseCopy);
				})()
			);
			if (request.headers.get('Accept').includes('text/html')) {
				try {
					return await responseFromFetch;
				} catch (error) {
					return caches.match(request);
				}
			} else {
				const responseFromCache = await caches.match(request);
				return responseFromCache || responseFromFetch;
			}
		})()
	);
});

// addEventListener('fetch', (event) => {
// 	const { request } = event;
//
// 	async function fetchCached() {
// 		const cache = await caches.open('trivia-v1');
//
// 		try {
// 			const response = await fetch(request);
//
// 			await cache.put(request, response.clone());
//
// 			return response;
// 		} catch (e) {
// 			return cache.match(request);
// 		}
// 	}
//
// 	event.respondWith(fetchCached());
// });
