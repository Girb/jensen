export function append(content, el) {
    if (content instanceof Element) {
        el.appendChild(content);
    } else if (typeof content === 'string' || typeof(content) === 'number' ) {
        el.innerHTML = content;
    }
}

export function create(elname, content, options = {}) {
    const el = document.createElement(elname);
    if (Array.isArray(content)) {
        content.forEach(c => append(c, el));
    } else {
        append(content, el);
    }
    if (options.className) {
        options.className.split(' ').forEach(c => el.classList.add(c));
    }
    return el;
}

export function tr(content, options) {
    return create('tr', content, options);
}

export function th(content, options) {
    return create('th', content, options);
}

export function td(content, options) {
    return create('td', content, options);
}

export function div(content, options) {
    return create('div', content, options);
}

export function span(content, options) {
    return create('span', content, options);
}

export function empty(el) {
    while(el.lastChild) {
        el.removeChild(el.lastChild);
    }
    return el;
}