export default class EventHost {
    constructor() {
        this.listeners = [];
        this.events = [];
    }
    on(type, listener, context) {
        this._addListener(type, listener, false, context);
    }
    once(type, listener, context) {
        this._addListener(type, listener, true, context);
    }
    off(eventType, listenerFunc) {
        const typeidx = this.events.indexOf(eventType);
        const hasType = eventType && typeidx !== -1;
        if( !hasType ) return;

        if( !listenerFunc ) {
            delete this.listeners[eventType];
            this.events.splice(typeidx, 1);
        } else {
            (function() {
                const removedEvents = [];
                const typeListeners = this.listeners[eventType];
                typeListeners.forEach(function(f, idx) {
                    if( f.f === listenerFunc ) {
                        removedEvents.unshift(idx);
                    }
                });
                removedEvents.forEach(function(idx) {
                    typeListeners.splice(idx, 1);
                });
                if( !typeListeners.length ) {
                    this.events.splice(typidx, 1);
                    delete this.listeners[eventType];
                }
            }.bind(this))();
        }
    }
    trigger(type) {
        for( let len = arguments.length, eventArgs = Array(len > 1 ? len - 1 : 0), key = 1; key < len; key++ ) {
            eventArgs[key-1] = arguments[key];
        }
        this._applyEvents(type, eventArgs);
    }
    destroy() {
        this.listeners = [];
        this.events = [];
    }
    _addListener(type, listener, once, context) {
        if( typeof listener !== 'function' ) {
            throw TypeError('Listener must be a function');
        }

        var x = {once, context, f: listener};
        if( this.events.indexOf(type) === -1 ) {
            this.listeners[type] = [x];
            this.events.push(type);
        } else {
            this.listeners[type].push(x);
        }
    }
    _applyEvents(eventType, eventArguments) {
        const typeListeners = this.listeners[eventType];
        if( !typeListeners || !typeListeners.length ) return;

        var removableListeners = [];
        typeListeners.forEach(function(l, idx) {
            l.f.apply(l.context, eventArguments);
            if( l.once ) {
                removableListeners.unshift(idx);
            }
        });
        removableListeners.forEach(function(idx) {
            typeListeners.splice(idx, 1);
        });
    }
}
