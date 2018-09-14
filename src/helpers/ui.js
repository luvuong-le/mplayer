export default {
	/**
	 * @param {String} Tag
	 * @param {Object} attributes={}
	 * @param {String} text=null
	 * @description Creates a new element and assigns necessary attributes and textContent
	 * @returns  {HTMLElement} element
	 */

	el: (tag, attributes = {}, text = null, styles = {}) => {
		let el = document.createElement(tag);

		// Set Attributes
		for (let attr in attributes) {
			el.setAttribute(attr, attributes[attr]);
		}

		// Set styles
		for (let styl in styles) {
			el.style[styl] = styles[styl];
		}

		el.textContent = text;

		return el;
	},

	/**
	 * @param  {HTMLElement} parent
	 * @param  {HTMLElement} child
	 */

	append: (parent, child) => {
		parent.appendChild(child);
	},

	/**
	 * @param  {HTMLElement} el
	 * @param  {String} className
	 */

	addClass: (el, className) => {
		el.classList.add(className);
	},

	/**
	 * @param  {HTMLElement} el
	 * @param  {String} className
	 */

	rmClass: (el, className) => {
		el.classList.remove(className);
	},

	setNewClass: (el, className) => {
		el.classList = [];
		el.className = className;
	},

	/**
	 * @param  {String} elName
	 */

	getElId: elName => {
		return document.getElementById(elName);
	},

	/**
	 * @param  {HTMLElement} parent
	 * @param  {Array of HTMLElements} children
	 */
	appendMulti: function(parent, children) {
		children.forEach(el => this.append(parent, el));
	},

	/**
	 * @param  {Array} classes
	 * @param  {String} id=''
	 */
	createIcon: function(classes, id = '') {
		let el = this.el('span', { id, class: classes.join(' ') });
		el.style.pointerEvents = 'none';
		return el;
	},

	/**
	 * @param  {String} elClass
	 */

	query: elClass => {
		return document.querySelector(elClass);
	},

	/**
	 * @param  {String} elClass
	 */
	queryAll: elClass => {
		return document.querySelectorAll(elClass);
	},

	removeClassAll: function(elQuery, className) {
		Array.from(document.querySelectorAll(elQuery)).forEach(el => {
			this.rmClass(el, className);
		});
	},
};