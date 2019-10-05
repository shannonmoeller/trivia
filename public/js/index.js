import { html, refs, repeat } from './vendor.js';
import { createTriviaStore } from './store.js';

function App() {
	const store = createTriviaStore();
	const game = Game(store);

	return game;
}

const gameTemplate = html`
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

function Game(store) {
	const view = gameTemplate();
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

	root.update = (props) => {
		const { index, showQuestion, showAnswer, questions, players } = props;
		const { question, answer } = questions[index];

		elQuestion.textContent = showQuestion ? question : '';
		elAnswer.textContent = showAnswer ? answer : '';

		repeat({
			parent: elPlayers,
			items: players,
			key: 'name',
			create: (item) => Player(store, item),
			update: (el, item) => el.update(item),
		});
	};

	store.subscribe(root.update);

	return root;
}

const playerTemplate = html`
	<li ref="root" class="trivia-player">
		<span ref="elName" class="trivia-player-name"></span>
		<button ref="btnDecrement">-</button>
		<input ref="elScore" type="number" value="0" readonly />
		<button ref="btnIncrement">+</button>
	</li>
`;

function Player(store, props) {
	const view = playerTemplate();
	const { root, elName, elScore, btnDecrement, btnIncrement } = refs(view);

	root.update = (props) => {
		elName.textContent = props.name;
		elScore.value = props.score;

		btnDecrement.onclick = () => store.decrementScore(props.name);
		btnIncrement.onclick = () => store.incrementScore(props.name);
	};

	root.update(props);

	return root;
}

document.body.append(App());
