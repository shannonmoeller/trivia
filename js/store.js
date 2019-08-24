const tick = Promise.resolve();

export function createStore(state) {
	const listeners = new Set();

	return {
		get() {
			return state;
		},

		set(patch) {
			const prev = state;

			state = { ...prev, ...patch };

			listeners.forEach((fn) => {
				tick.then(() => fn(state, prev));
			});
		},

		addListener(fn) {
			listeners.add(fn);

			return () => {
				listeners.delete(fn);
			};
		},
	};
}
