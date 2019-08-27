const CACHE = 'offline';

async function toCache(event, response) {
	const clone = response.clone();
	const cache = await caches.open(CACHE);

	return cache.put(event.request, clone);
}

async function fromCache(event) {
	const cache = await caches.open(CACHE);

	return cache.match(event.request);
}

async function fromNetwork(event) {
	const response = await fetch(event.request);

	event.waitUntil(toCache(event, response));

	return response;
}

async function load(event) {
	try {
		return await fromNetwork(event);
	} catch (e) {
		return await fromCache(event);
	}
}

addEventListener('fetch', (event) => {
	event.respondWith(load(event));
});
