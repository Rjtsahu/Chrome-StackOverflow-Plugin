let DomFactory = () => {

	this.showCollapsibleItem = function (questionObject, elementId) {
		let el = document.getElementById(elementId);
		`         <div class="card blue-grey darken-1">
		<div class="card-content white-text">`
		let questionCardElement = createElement('div', {
			classList: ['card', 'blue-grey', 'darken-1'],
			child: createElement('div', {
				classList: ['card-content white-text question-body'],
				child: questionObject.inner_html
			})
		});

		el.appendChild(questionCardElement);

		el.appendChild(prepareAllAnswer(questionObject.answers));

		document.querySelectorAll('pre code').forEach(e => { e.setAttribute('class', 'microlight'); });
		microlight.reset();
	}

	this.prepareAllAnswer = (answers) => {

		return createElement('div', {
			classList: ['row'],
			child: createElement('div', {
				classList: ['col', 's12'],
				childList: answers.map(answer => prepareAnswerDiv(answer))
			})
		})
	}

	this.toggleBlockVisibility = () => {
		$('#search-header').toggleClass('block-hidden');
		$('#content-after-search').toggleClass('block-hidden');
	}

	this.showQuestionCollapsible = (questions) => {
		let collapsible = document.getElementById('collapsible-content');
		questions.forEach(question => {
			collapsible.appendChild(prepareQuestionListItem(question));
		});
	}

	this.prepareAnswerDiv = (answerObject) => {

		return createElement('div', {
			classList: ['card', 'white-grey', 'darken-1'],
			child: createElement('div', {
				classList: ['card-content', 'black-text', 'answer-body'],
				child: answerObject.inner_html,
				id: 'answer-' + answerObject.answer_id
			})
		});
	}

	this.prepareQuestionListItem = (question) => {

		return createElement('li', {
			childList: [
				createElement('div', {
					classList: ['collapsible-header'],
					childList: [createElement('i', {
						classList: ['material-icons'],
						child: 'question_answer'
					}), createElement('span', {
						classList: ['question-title'],
						child: question.title
					})]
				}),
				createElement('div', {
					classList: ['collapsible-body'],
					child: createElement('div', {
						classList: ['collapsible-item-content'],
						child: '',
						id: 'question-' + question.question_id
					})
				})
			]
		});

	}

	this.showLoader = () => {
		let loaderEl = document.getElementById('loader');
		if (loaderEl === null) {
			document.getElementById('container').appendChild(createElement('div', {
				classList: ['loader'],
				id: 'loader'
			}));
		}
	}

	this.hideLoader = () => {
		let loaderEl = document.getElementById('loader');
		if (loaderEl) {
			document.getElementById('container').removeChild(document.getElementById('loader'));
		}
	}

	this.removeCollapsibleContent = () => {
		removeChildrenElements('collapsible-content');
	}

	this.showRecentSearchItems = (items) => {
		let el = document.getElementById('recent-search-collection');
		removeChildrenElements(el);
		
		items.forEach(item => {
			el.appendChild(createElement('li', {
				classList: ['collection-item'],
				child: item
			}));
		});
	}

	
	function createElement (tagName, options) {
		options = options || {};
		let mElement = document.createElement(tagName);

		if (options.id) {
			mElement.setAttribute('id', options.id);
		}

		if (options.classList && Array.isArray(options.classList)) {
			mElement.setAttribute('class', options.classList.join(' '));
		}

		if (options.child) {
			if (options.child.nodeType === Node.ELEMENT_NODE) {
				mElement.appendChild(options.child);
			} else if (typeof (options.child) === 'string') {
				mElement.innerHTML = options.child;
			}
		} else if (options.childList && Array.isArray(options.childList)) {
			options.childList.forEach(childNode => {
				if (childNode.nodeType === Node.ELEMENT_NODE) {
					mElement.appendChild(childNode);
				}
			});
		}

		return mElement;
	}

	function removeChildrenElements(containerElement) {
		if (containerElement && (typeof containerElement === 'string' || containerElement.nodeType === Node.ELEMENT_NODE)) {
			if (typeof containerElement === 'string') {
				containerElement = document.getElementById(containerElement);
			}

			let childEl = containerElement.firstElementChild;
			while (childEl) {
				containerElement.removeChild(childEl);
				childEl = containerElement.firstElementChild;
			}
		}
	}

	return {
		showQuestionCollapsible,
		toggleBlockVisibility,
		showCollapsibleItem,
		showLoader,
		hideLoader,
		removeCollapsibleContent,
		showRecentSearchItems
	}
}