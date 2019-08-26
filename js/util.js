export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const MINUTE = 1000 * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function createStorage(key, version) {
	return {
		get() {
			const item = localStorage.getItem(key);
			const meta = item && JSON.parse(item);

			if (!meta) {
				return null;
			}

			if (meta.date !== getDayOfYear()) {
				return null;
			}

			if (meta.version !== version) {
				return null;
			}

			return meta.data;
		},

		async set(data) {
			const date = getDayOfYear();
			const meta = JSON.stringify({ date, version, data });

			await 'next tick';

			localStorage.setItem(key, meta);
		},
	};
}

export function getDayOfWeek() {
	return new Date().getDay();
}

export function getDayOfYear() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now - start;

	return Math.floor(diff / DAY);
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rotate(array, count) {
	const index = count % array.length;

	return array.slice(index).concat(array.slice(0, index));
}

export function shuffle(array) {
	const clone = array.slice();
	let i = clone.length;

	while (i) {
		const j = getRandomInt(0, i--);

		[clone[i], clone[j]] = [clone[j], clone[i]];
	}

	return clone;
}
