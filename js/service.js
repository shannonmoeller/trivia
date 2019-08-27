addEventListener('fetch', (event) => {
	const { request } = event;

	async function fetchCached() {
		const cache = await caches.open('trivia-v1');

		try {
			const response = await fetch(request);

			await cache.put(request, response.clone());

			return response;
		} catch (e) {
			return cache.match(request);
		}
	}

	event.respondWith(fetchCached());
});
