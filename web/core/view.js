import EventHost from './eventhost.js';

export default class View extends EventHost {
    constructor(options = {}) {
        super(options);
        Object.assign(this, options);
        this.el = this.el || document.createElement(this.tagName);
        if( this.className ) {
            this.className.split(' ').forEach(function(cn) {
                this.el.classList.add(cn);
            }, this);
        }
        this.el.setAttribute('id', this.id);
        var tmp = this.template;
        if( tmp ) {
            this.el.innerHTML = tmp;
        }
        this.initialize.apply(this, arguments);
    }
    initialize() {}
    get id() {
        return '';
    }
    get className() {
        return '';
    }
    get tagName() {
        return 'div';
    }
    get template() {
        return '';
    }
    all(selector) {
        return this.el.querySelectorAll(selector);
    }
    one(selector) {
        return this.el.querySelector(selector);
    }
    remove() {
        this.el.parentNode.removeChild(this.el);
        return this;
    }
    empty() {
        while(this.el.lastChild) {
            this.el.removeChild(this.el.lastChild);
        }
    }
    isFunction(x) {
        return typeof(x) === 'function';
    }
    append(el) {
        this.el.appendChild(el);
    }
    render() {
        return this;
    }
}
