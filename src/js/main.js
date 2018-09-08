import { review, general } from './questions.js';
import { getDayOfYear, shuffleArray } from './util.js';

const a = [].concat(review, shuffleArray(general));
const b = [];

class TriviaAppElement extends HTMLElement {
	constructor() {
		super();

		this.addEventListener('click', this.onClick);
	}

	connectedCallback() {
		this.questionElement = this.querySelector('[trivia-app-question]');
		this.answerElement = this.querySelector('[trivia-app-answer]');
	}

	prevQuestion() {
		const prev = b.shift();

		if (prev) {
			a.unshift(prev);
		}

		this.askQuestion();
	}

	nextQuestion() {
		const next = a.shift();

		if (next) {
			b.unshift(next);
		}

		this.askQuestion();
	}

	askQuestion() {
		const { question } = b[0] || {};

		this.questionElement.innerHTML = question || '';
		this.answerElement.innerHTML = '';
	}

	answerQuestion() {
		const { question, answer } = b[0] || {};

		this.questionElement.innerHTML = question || '';
		this.answerElement.innerHTML = answer || '';
	}

	hideQuestion() {
		this.questionElement.innerHTML = '';
		this.answerElement.innerHTML = '';
	}

	onClick(event) {
		const { name } = event.target;

		if (typeof this[name] === 'function') {
			this[name](event);
		}
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

customElements.define('trivia-players', TriviaPlayersElement);
customElements.define('trivia-app', TriviaAppElement);
