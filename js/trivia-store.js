import { createStorage } from './storage.js';
import { createStore } from './store.js';
import { review, general } from './questions.js';
import { shuffleArray } from './util.js';

export function createTriviaStore(version) {
	const { get, set } = createStorage('trivia', version);

	const store = createStore(
		get() || {
			index: -1,
			questions: [...review, ...general],
			questionOrder: [
				...review.map((x, i) => i),
				...shuffleArray(general.map((x, i) => i + review.length)),
			],
			scores: {
				clara: 0,
				alan: 0,
			},
		}
	);

	store.addListener(set);

	return {
		...store,

		getQuestion() {
			const { index, questions, questionOrder } = store.get();

			return questions[questionOrder[index]];
		},

		prevQuestion() {
			const { index } = store.get();

			store.set({
				index: Math.max(-1, index - 1),
			});
		},

		nextQuestion() {
			const { index, questions } = store.get();

			store.set({
				index: Math.min(questions.length - 1, index + 1),
			});
		},

		incrementScore(id) {
			const { scores } = store.get();

			store.set({
				scores: {
					...scores,
					[id]: scores[id] + 1,
				},
			});
		},

		decrementScore(id) {
			const { scores } = store.get();

			store.set({
				scores: {
					...scores,
					[id]: scores[id] - 1,
				},
			});
		},
	};
}
