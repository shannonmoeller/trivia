import { getDayOfYear } from './util.js';

export function createStorage(namespace, version = '1') {
	return {
		get() {
			try {
				const item = localStorage.getItem(namespace);

				if (!item) {
					return null;
				}

				const meta = JSON.parse(item);
				const isFresh =
					meta &&
					meta.date === getDayOfYear() &&
					meta.version === version;

				if (!isFresh) {
					return null;
				}

				return meta.data;
			} catch (e) {
				return null;
			}
		},

		set(data) {
			const meta = {
				date: getDayOfYear(),
				version,
				data,
			};

			const item = JSON.stringify(meta);

			localStorage.setItem(namespace, item);
		},
	};
}
