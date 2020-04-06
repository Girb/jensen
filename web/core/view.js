import EventHost from './eventhost.js';

export default class View extends EventHost {
    constructor(options = {}) {
        super(options);
        Object.assign(this, options);
        this._ensureElement();
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
    _ensureElement() {
        if (!this.el) {
            const el = document.createElement(this.tagName);
            if( this.className ) {
                this.className.split(' ').forEach(function(cn) {
                    el.classList.add(cn);
                }, this);
            }
            el.setAttribute('id', this.id);
            this.setElement(el);
        } else {
            this.setElement(this.el);
        }
    }
    setElement(el) {
        // undelegate events?
        this.el = el;
        this.delegateEvents();
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
    delegateEvents(events) {
        events || (events = this.isFunction(this.events) ? this.events.call(this) : this.events);
        if (events) {
            for (let key in events) {
                let method = events[key];
                if (!this.isFunction(method)) method = this[method];
                if (!method) continue;
                const match = key.match(/^(\S+)\s*(.*)$/);
                this.delegate(match[1], match[2], method.bind(this));
            }
        }
        return this;
    }
    delegate(eventName, selector, listener) {
        const handleEvent = e => {
            let targetel = e.target;
            while (targetel != null) {
                if (targetel.matches(selector)) {
                    listener(e);
                    return;
                }
                targetel = targetel.parentElement;
            }
        };
        this.el.addEventListener(eventName, handleEvent);
        // this.all(selector).forEach(el => {
        //     el.addEventListener(eventName, listener);
        // });
    }
    append(el) {
        this.el.appendChild(el);
    }
    render() {
        return this;
    }
}
