const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function getDayOfYear() {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now - start;

	return Math.floor(diff / DAY);
}

export function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function shuffleArray(array) {
	const clone = array.slice();
	let i = clone.length;

	while (i--) {
		const j = getRandomInt(i + 1);
		[clone[i], clone[j]] = [clone[j], clone[i]];
	}

	return clone;
}
