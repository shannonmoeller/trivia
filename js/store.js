import { createStore } from './vendor.js';
import { reviewQuestions, generalQuestions } from './questions.js';
import {
	WEDNESDAY,
	THURSDAY,
	createStorage,
	getDayOfWeek,
	getDayOfYear,
	rotate,
	shuffle,
} from './util.js';

const INTROS = {
	[WEDNESDAY]: 'Stump day!',
	[THURSDAY]: 'Thanks day!',
};

export function createTriviaGame() {
	const intro = {
		question: INTROS[getDayOfWeek()] || '',
		answer: '',
	};

	const players = [
		{
			name: 'Clara',
			score: 0,
		},
		{
			name: 'Alan',
			score: 0,
		},
	];

	return {
		index: 0,
		showQuestion: true,
		showAnswer: false,
		questions: [intro, ...reviewQuestions, ...shuffle(generalQuestions)],
		players: rotate(players, getDayOfYear()),
	};
}

export function createTriviaStore() {
	const storage = createStorage('trivia', 2);
	const store = createStore(storage.get() || createTriviaGame());

	store.subscribe(storage.set);

	return {
		...store,

		prev() {
			store.set((prev) => ({
				...prev,
				index: Math.max(0, prev.index - 1),
				showQuestion: true,
				showAnswer: false,
			}));
		},

		next() {
			store.set((prev) => ({
				...prev,
				index: Math.min(prev.questions.length - 1, prev.index + 1),
				showQuestion: true,
				showAnswer: false,
			}));
		},

		hideQuestion() {
			store.set((prev) => ({
				...prev,
				showQuestion: false,
				showAnswer: false,
			}));
		},

		showQuestion() {
			store.set((prev) => ({
				...prev,
				showQuestion: true,
				showAnswer: false,
			}));
		},

		showAnswer() {
			store.set((prev) => ({
				...prev,
				showQuestion: true,
				showAnswer: true,
			}));
		},

		decrementScore(name) {
			store.set((prev) => ({
				...prev,
				players: prev.players.map((player) => {
					if (player.name !== name) {
						return player;
					}

					return {
						...player,
						score: player.score - 1,
					};
				}),
			}));
		},

		incrementScore(name) {
			store.set((prev) => ({
				...prev,
				players: prev.players.map((player) => {
					if (player.name !== name) {
						return player;
					}

					return {
						...player,
						score: player.score + 1,
					};
				}),
			}));
		},
	};
}
