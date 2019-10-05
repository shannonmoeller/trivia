import { createStore } from './vendor.js';
import { questions } from './questions.js';
import {
	getStorage,
	setStorage,
	getDayOfWeek,
	getDayOfYear,
	rotate,
} from './util.js';

const INTROS = [
	'Fun day!',
	'Monday!',
	'Tuesday!',
	'Stump day!',
	'Thanks day!',
	'Fruit day!',
	'Saturday!',
];

function getGame() {
	const prevGame = getStorage('game') || {};
	const dayOfYear = getDayOfYear();

	if (prevGame.id === dayOfYear) {
		return prevGame;
	}

	const prevIndex = prevGame.index || 0;
	const prevOffset = prevGame.offset || 0;
	const offset = prevIndex + prevOffset;

	const intro = {
		question: INTROS[getDayOfWeek()],
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
		id: dayOfYear,
		index: 0,
		offset,
		showQuestion: true,
		showAnswer: false,
		players: rotate(players, dayOfYear),
		questions: [intro, ...rotate(questions, offset)],
	};
}

function setGame(nextState) {
	setStorage('game', nextState);
}

export function createTriviaStore() {
	const store = createStore(getGame());

	store.subscribe(setGame);

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
				index: prev.index + 1,
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
