export default class Route {
    constructor(path, callback, router) {
        this.path = path;
        this.callback = callback;
        this.router = router;
        this.values = [];
    }
    regex() {
        let path = this.path;
        if( typeof path === 'string' ) {
            return new RegExp('^' + path.replace(/\//g, '\\/').replace(this.router.namedParam.match, this.router.namedParam.replace) + '$');
        }
        return path;
    }
    params() {
        let obj = {}, values = this.values, params = values, t = 0, path = this.path;
        if( typeof path === 'string' ) {
            t = 1;
            params = path.match(this.router.namedParam.match);
        }

        for( let i in params ) {
            let name = t ? params[i].replace(this.router.namedParam.match, '$1') : i;
            obj[name] = values[i];
        }
        return obj;
    }
    test(url) {
        let matches = url.match(this.regex());
        if( matches ) {
            this.values = matches.slice(1);
            return true;
        }
        return false;
    }
    run() {
        if( typeof this.callback === 'string' ) {
            return this.router.handler[this.callback](this.params());
        }
        return this.callback.apply(this.router, [this.params()]);
    }
}
