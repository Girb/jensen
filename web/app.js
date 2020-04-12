import Router from './core/router.js';
import StandingsTable from './views/standingstable.js';
import CoronaView  from './views/corona.js';
import { CoronaNotesView } from './views/corona.js';
import { empty } from './core/html.js';

export default  class App extends Router {
    get routes() {
        return {
            '': 'home',
            'corona': 'corona',
            'coronanotes': 'coronanotes'
        };
    }
    home() {
        const t = new StandingsTable();
        empty(document.body).appendChild(t.render().el);
    }
    corona() {
        const c = new CoronaView();
        empty(document.body).appendChild(c.render().el);
    }
    coronanotes() {
        const cn = new CoronaNotesView();
        empty(document.body).appendChild(cn.render().el);
    }
}
