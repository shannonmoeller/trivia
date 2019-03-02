import { createTriviaStore } from './trivia-store.js';
import {
	WEDNESDAY,
	THURSDAY,
	getDayOfWeek,
	getDayOfYear,
	shuffleArray,
} from './util.js';

const version = import.meta.url.split('?').pop();
const store = createTriviaStore(version);
const defaultMessages = {
	[WEDNESDAY]: 'Stump Day!',
	[THURSDAY]: 'Thanks Day!',
};

function onActionClick(event) {
	const { target } = event;
	const { name } = target || {};

	if (name && typeof this[name] === 'function') {
		event.preventDefault();
		this[name](target);
	}
}

class TriviaAppElement extends HTMLElement {
	constructor() {
		super();

		this.defaultMessage = defaultMessages[getDayOfWeek()] || '';
		this.askQuestion = this.askQuestion.bind(this);

		this.addEventListener('click', onActionClick);
	}

	connectedCallback() {
		this.questionElement = this.querySelector('[trivia-app-question]');
		this.answerElement = this.querySelector('[trivia-app-answer]');
		this.removeStoreListener = store.addListener(this.askQuestion);

		this.askQuestion();
	}

	disconnectedCallback() {
		this.removeStoreListener();
	}

	prevQuestion() {
		store.prevQuestion();
	}

	nextQuestion() {
		store.nextQuestion();
	}

	askQuestion() {
		const { defaultMessage } = this;
		const { question } = store.getQuestion() || {};

		this.questionElement.innerHTML = question || defaultMessage;
		this.answerElement.innerHTML = '';
	}

	answerQuestion() {
		const { question, answer } = store.getQuestion() || {};

		this.questionElement.innerHTML = question || '';
		this.answerElement.innerHTML = answer || '';
	}

	hideQuestion() {
		this.questionElement.innerHTML = '';
		this.answerElement.innerHTML = '';
	}
}

class TriviaPlayersElement extends HTMLElement {
	connectedCallback() {
		const children = Array.from(this.children);
		const whoFirst = getDayOfYear() % children.length;

		children.forEach((child, i) => {
			if (i < whoFirst) {
				this.appendChild(child);
			}
		});
	}
}

class TriviaPlayerElement extends HTMLElement {
	constructor() {
		super();

		this.update = this.update.bind(this);

		this.addEventListener('click', onActionClick);
	}

	connectedCallback() {
		this.name = this.getAttribute('name');
		this.inputElement = this.querySelector('input');
		this.removeStoreListener = store.addListener(this.update);

		this.update(store.get());
	}

	disconnectedCallback() {
		this.removeStoreListener();
	}

	incrementScore() {
		store.incrementScore(this.name);
	}

	decrementScore() {
		store.decrementScore(this.name);
	}

	update(state) {
		const { inputElement, name } = this;

		inputElement.value = state.scores[name];
	}
}

customElements.define('trivia-app', TriviaAppElement);
customElements.define('trivia-players', TriviaPlayersElement);
customElements.define('trivia-player', TriviaPlayerElement);
