export default class EventHost {
    constructor() {
        this._listeners = [];
        this._events = [];
    }
    on(type, listener, context) {
        this._addListener(type, listener, false, context);
    }
    once(type, listener, context) {
        this._addListener(type, listener, true, context);
    }
    off(eventType, listenerFunc) {
        const typeidx = this._events.indexOf(eventType);
        const hasType = eventType && typeidx !== -1;
        if( !hasType ) return;

        if( !listenerFunc ) {
            delete this._listeners[eventType];
            this._events.splice(typeidx, 1);
        } else {
            (function() {
                const removedEvents = [];
                const typeListeners = this._listeners[eventType];
                typeListeners.forEach(function(f, idx) {
                    if( f.f === listenerFunc ) {
                        removedEvents.unshift(idx);
                    }
                });
                removedEvents.forEach(function(idx) {
                    typeListeners.splice(idx, 1);
                });
                if( !typeListeners.length ) {
                    this._events.splice(typidx, 1);
                    delete this._listeners[eventType];
                }
            }.bind(this))();
        }
    }
    trigger(type) {
        const len = arguments.length;
        const eventArgs = Array(len > 1 ? len - 1 : 0);
        for( let key = 1; key < len; key++ ) {
            eventArgs[key-1] = arguments[key];
        }
        this._applyEvents(type, eventArgs);
    }
    destroy() {
        this._listeners = [];
        this._events = [];
    }
    _addListener(type, listener, once, context) {
        if( typeof listener !== 'function' ) {
            throw TypeError('Listener must be a function');
        }

        var x = {once, context, f: listener};
        if( this._events.indexOf(type) === -1 ) {
            this._listeners[type] = [x];
            this._events.push(type);
        } else {
            this._listeners[type].push(x);
        }
    }
    _applyEvents(eventType, eventArguments) {
        const typeListeners = this._listeners[eventType];
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
