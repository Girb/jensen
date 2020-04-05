import View from '../core/view.js';
import { div, tr, th, td, empty } from '../core/html.js';


class CoronaHeaderView extends View {
    get tagName() { return 'tr'; }
    render() {
        empty(this.el);
        this.el.appendChild(th(''))
        this.players.forEach(p => {
            this.el.appendChild(th(p.nick));
        });
        return this;
    }
}

class CoronaRowView extends View {
    get tagName() { return 'tr'; }
    render() {
        empty(this.el);
        this.el.appendChild(td('Kjør'));
        this.players.forEach( p => {
            this.el.appendChild(td(p.scores[this.index], { className: 's' }));
        });
        return this;
    }
}

class CoronaTotalRowView extends View {
    get tagName() { return 'tr'; }
    get className() { return 'total'; }
    render() {
        empty(this.el);
        this.el.appendChild(td(''));
        this.players.forEach(p => {
            this.el.appendChild(td(p.total, { className: 's' }));
        });
        return this;
    }
}

class CoronaLaneView extends View {
    get className() { return 'lane'; }
    initialize(options) {
        this.reveal = 0;
    }
    recalc() {
        const revealed = this.player.scores.slice(0, this.reveal);
        const sum = revealed.reduce((sum, x) => sum + x);
        const tot = this.el.getElementsByClassName('total')[0];
        empty(tot);
        tot.innerHTML = ''+sum;

    }
    render() {
        empty(this.el);
        const btn = document.createElement('button');
        btn.innerHTML = this.player.nick;
        btn.classList.add('name');
        this.append(btn);
        this.player.scores.forEach((s, idx) => {
            this.append(div(s, { className: 's r' + idx }));
        });
        this.append(div(0, { className: 'total' }));
        btn.addEventListener('click', e => {
            if (this.reveal === 10) {
                e.target.disabled = true;
                const d = new Date(this.player.date);
                e.target.innerHTML += ' ' + d.toLocaleDateString();
            } else {
                this.el.getElementsByClassName('r' + this.reveal)[0].classList.add('reveal');
                this.reveal++;
                this.recalc();
            }
        });
        document.documentElement.getel
        return this;
    }
}

class CoronaRoundView extends View {
    get className() { return 'round'; }
    render() {
        empty(this.el);
        Promise.all([
            fetch(`http://localhost:3000/game/randomround/${this.player1id}`).then(r => r.json()),
            fetch(`http://localhost:3000/game/randomround/${this.player2id}`).then(r => r.json())
        ])
        .then(([p1, p2]) => {
            const players = [p1, p2];
            players.forEach(player => {
                this.append(new CoronaLaneView({ player }).render().el);
            });
            // const tbl = document.createElement('table');
            // this.el.appendChild(tbl);
            // tbl.appendChild(new CoronaHeaderView({ players }).render().el);
            // for (let i = 0; i < 10; i++) {
            //     tbl.appendChild(new CoronaRowView({ index: i, players: [p1, p2] }).render().el);
            // }
            // tbl.appendChild(new CoronaTotalRowView({ players }).render().el);
        });
        return this;
    }
}

export default class CoronaView extends View {
    get className() { return 'corona'; }
    render() {
        this.empty();
        const rr = new CoronaRoundView({ player1id: 11, player2id: 4 });
        this.el.appendChild(rr.render().el);
        return this;
    }
}
