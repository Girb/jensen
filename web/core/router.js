import EventHost from './eventhost.js';
import Route from './route.js';

const NAMEDPARAM = '([\\w-]+)';

export default class Router extends EventHost {
    constructor(options = {}) {
        super(options);
        this._routes = [];
        this.namedParam = {
            match: new RegExp('{(' + NAMEDPARAM + ')}', 'g'),
            replace: NAMEDPARAM
        };
        this.type = options.type || 'hash';
        this.path = options.path;
        this.pathRoot = options.pathRoot || '/';
        this.hash = options.hash || null;
        this.handler = this;
        if( this.routes ) {
            for(let route in this.routes) {
                this.add(route, this.routes[route]);
            }
        }
        window.onhashchange = this.apply.bind(this);
    }
    add(route, callback) {
        this._routes.push(new Route(route, callback, this));
        return this;
    }
    clear() {
        this.routes = [];
        return this;
    }
    getUrl(routeType) {
        routeType = routeType || this.type;
        var url;
        if( routeType == 'path' ) {
            var rootRegex = new RegExp('^' + this.pathRoot + '/?');
            url = this.path || window.location.pathname.substring(1);
            url = url.replace(rootRegex);
        } else if( routeType == 'hash' ) {
            url = this.hash || this.getFragment(window.location.hash);
        }
        return decodeURI(url);
    }
    match(path, callback) {
        let route = new Route(path, callback, this);
        if( route.test(this.getUrl()) ) {
            return route.run();
        }
    }
    getFragment(fragment) {
        return fragment.replace(/^[#\/]+|\s+$/g, ''); // remove leading slashes/hashes, trailing spaces
    }
    navigate(fragment, options) {
        if( !options || options === true) options = { trigger: options };
        fragment = this.getFragment(fragment || '');
        // TO_DO: concat with pathroot?
        // TO_DO: decode fragment?
        this.fragment = fragment;
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
        if( options.trigger ) {
            return this.apply();
        }
    }
    start() {
        this.apply();
    }
    apply() {
        let url = this.getUrl();
        for( let n in this._routes ) {
            let route = this._routes[n];
            if( route.test(url) ) {
                route.run();
                return route;
            }
        }
    }


}
