export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function getStorage(key) {
	const item = localStorage.getItem(key);

	return item && JSON.parse(item);
}

export function setStorage(key, value) {
	const item = JSON.stringify(value);

	localStorage.setItem(key, item);
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

export function rotate(array, count) {
	const index = count % array.length;
	const a = array.slice(index);
	const b = array.slice(0, index);

	return a.concat(b);
}
