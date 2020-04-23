import View from '../core/view.js';
import { tr, th, td } from '../core/html.js';

class StandingsTableRow extends View {
    get tagName() { return 'tr'; }
    render() {
        this.empty();
        this.el.appendChild(td(this.row.etternavn));
        this.el.appendChild(td(this.row.turnup, { className: 'n' }));
        this.el.appendChild(td(this.row.turnupPoints, { className: 'n' }));
        this.el.appendChild(td(this.row.snitt, { className: 'n' }));
        this.el.appendChild(td(this.row.avgPoints, { className: 'n' }));
        this.el.appendChild(td(this.row.totalPoints, { className: 'n' }));
        return this;
    }
}

export default class StandingsTable extends View {
    get tagName() { return 'table'; }
    get className() { return 'standings'; }
    render() {
        this.empty();
        this.el.appendChild(tr([th('Navn'), th('Mø', { className: 'n' }), th('P', { className: 'n' }), th('Snitt', { className: 'n' }), th('P'), th('Tot', { className: 'n' })]));
        const y = new Date().getFullYear();
        fetch(`/standings/${y}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.forEach(row => {
                const trow = new StandingsTableRow({ row });
                this.el.appendChild(trow.render().el);
            });
        });
        return this;
    }
}
