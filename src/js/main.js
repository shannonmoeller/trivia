import { review, general } from './questions.js';
import { getDayOfYear, shuffleArray } from './util.js';

const a = [].concat(review, shuffleArray(general));
const b = [];

class TriviaAppElement extends HTMLElement {
	constructor() {
		super();

		this.addEventListener('click', this.onClick);
		this.addEventListener('keydown', this.onKeyDown);
	}

	connectedCallback() {
		this.setAttribute('tabindex', '0');
		this.focus();

		this.questionElement = this.querySelector('[trivia-app-question]');
		this.answerElement = this.querySelector('[trivia-app-answer]');

		switch (new Date().getDay()) {
			case 3:
				this.questionElement.innerHTML = 'Stump Day!';
				break;

			case 4:
				this.questionElement.innerHTML = 'Thanks Day!';
				break;
		}
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

	incrementPlayer(index) {
		const playerInputs = this.querySelectorAll('input[type="number"]');

		playerInputs[index].value++;
	}

	decrementPlayer(index) {
		const playerInputs = this.querySelectorAll('input[type="number"]');

		playerInputs[index].value--;
	}

	onClick(event) {
		const { name } = event.target;

		if (typeof this[name] === 'function') {
			this[name](event);
		}
	}

	onKeyDown({ key, target }) {
		if (target !== this) {
			return;
		}

		switch (key) {
			case 'ArrowLeft':
				this.prevQuestion();
				break;

			case 'ArrowRight':
				this.nextQuestion();
				break;

			case 'q':
				this.askQuestion();
				break;

			case 'a':
				this.answerQuestion();
				break;

			case 'x':
				this.hideQuestion();
				break;

			case '1':
				this.incrementPlayer(0);
				break;

			case '!':
				this.decrementPlayer(0);
				break;

			case '2':
				this.incrementPlayer(1);
				break;

			case '@':
				this.decrementPlayer(1);
				break;
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
