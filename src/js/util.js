export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const MINUTE = 1000 * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function getDayOfYear() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now - start;

	return Math.floor(diff / DAY);
}

export function getDayOfWeek() {
	return new Date().getDay();
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(array) {
	const clone = array.slice();
	let i = clone.length;

	while (i) {
		const j = getRandomInt(0, i--);

		[clone[i], clone[j]] = [clone[j], clone[i]];
	}

	return clone;
}
