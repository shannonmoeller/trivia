import { html, refs, repeat } from './vendor.js';
import { createTriviaStore } from './store.js';

const store = createTriviaStore();

const playerTemplate = html`
	<li ref="root" class="trivia-player">
		<span ref="elName" class="trivia-player-name"></span>
		<button ref="btnDecrement">-</button>
		<input ref="elScore" type="number" value="0" readonly />
		<button ref="btnIncrement">+</button>
	</li>
`;

function Player(initialState) {
	const view = playerTemplate();
	const { root, elName, elScore, btnDecrement, btnIncrement } = refs(view);

	root.update = (state) => {
		elName.textContent = state.name;
		elScore.value = state.score;

		btnDecrement.onclick = () => {
			store.decrementScore(state.id);
		};

		btnIncrement.onclick = () => {
			store.incrementScore(state.id);
		};
	};

	root.update(initialState);

	return root;
}

const appTemplate = html`
	<div ref="root" class="trivia">
		<div ref="elQuestion" class="trivia-question"></div>
		<div ref="elAnswer" class="trivia-answer"></div>
		<ol ref="elPlayers" class="trivia-players"></ol>
		<div class="trivia-actions">
			<button ref="btnPrev">←</button>
			<button ref="btnHide">X</button>
			<button ref="btnQuestion">Q</button>
			<button ref="btnAnswer">A</button>
			<button ref="btnNext">→</button>
		</div>
	</div>
`;

function App() {
	const view = appTemplate();
	const {
		root,
		elQuestion,
		elAnswer,
		elPlayers,
		btnPrev,
		btnHide,
		btnQuestion,
		btnAnswer,
		btnNext,
	} = refs(view);

	btnPrev.onclick = store.prev;
	btnHide.onclick = store.hideQuestion;
	btnQuestion.onclick = store.showQuestion;
	btnAnswer.onclick = store.showAnswer;
	btnNext.onclick = store.next;

	root.update = (state) => {
		const { index, questions, showQuestion, showAnswer, players } = state;
		const currentQuestion = questions[index];

		elQuestion.textContent = showQuestion ? currentQuestion.question : '';
		elAnswer.textContent = showAnswer ? currentQuestion.answer : '';

		repeat({
			parent: elPlayers,
			items: players,
			key: 'id',
			create: Player,
			update: (el, item) => el.update(item),
		});
	};

	store.subscribe(root.update);

	return root;
}

document.body.append(App());
