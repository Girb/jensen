import View from '../core/view.js';
import { div, tr, th, td, h1, ul, li, button, empty } from '../core/html.js';
import { url } from '../util.js';


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
    get events() {
        return {
            'click .name': 'advance'
        };
    }
    advance(e, all) {
        if (!all && e.shiftKey) {
            for (let i = this.reveal; i <= 10; i++) {
                this.advance(e, true);
            }
        } else {
            if (this.reveal < 10) {
                this.el.getElementsByClassName('r' + this.reveal)[0].classList.add('reveal');
                this.reveal++;
                this.recalc();
                if (this.reveal === 10) {
                    e.target.disabled = true;
                    const d = new Date(this.player.date);
                    e.target.innerHTML += ' (' + d.toLocaleDateString() + ')';
                }
            }
        }
    }
    recalc() {
        const revealed = this.scores.slice(0, this.reveal);
        const sum = revealed.reduce((sum, x) => sum + x);
        const tot = this.el.getElementsByClassName('total')[0];
        empty(tot);
        tot.innerHTML = ''+sum;

    }
    shuffle(scores) {
        return scores.map(a => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
    }
    render() {
        empty(this.el);
        const btn = document.createElement('button');
        btn.innerHTML = this.player.nick;
        btn.classList.add('name');
        this.append(btn);
        this.scores = this.shuffle(this.player.scores);
        this.scores.forEach((s, idx) => {
            this.append(div(s, { className: 's r' + idx }));
        });
        this.append(div(0, { className: 'total' }));
        return this;
    }
}

class CoronaRoundView extends View {
    get className() { return 'round'; }
    render() {
        empty(this.el);
        const calls = this.playerids.map(pid => fetch(url(`game/randomround/${pid}`)).then(r => r.json()));
        Promise.all(calls)
        .then()
        .then(ps => {
            const players = ps;
            players.forEach(player => {
                this.append(new CoronaLaneView({ player }).render().el);
            });
        });
        return this;
    }
}

class SelectParticipantsView extends View {
    get className() { return 'selectparticipants'; }
    get events() {
        return {
            'click .start': 'start'
        };
    }
    start(e) {
        e.preventDefault();
        const playerids = [...this.all('input:checked')].map(chk => chk.value);
        this.trigger('start', playerids);
    }
    render() {
        empty(this.el);
        this.el.appendChild(h1('Velg deltakere'));
        const list = ul();
        this.el.appendChild(list);
        fetch(url('players'))
        .then(response => response.json())
        .then(data => {
            data.forEach(player => {
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.id = 'c' + player.slager_id;
                chk.value = player.slager_id;
                const lbl = document.createElement('label');
                lbl.setAttribute('for', 'c' + player.slager_id);
                lbl.innerHTML = player.etternavn;
                const itm = li([chk, lbl]);
                list.appendChild(itm);
            });
            const btn = button('Start', { className: 'start' });
            this.el.appendChild(btn);
        });
        return this;
    }
}

export class CoronaNotesView extends View {
    get className() { return 'coronanotes'; }
    render() {
        empty(this.el);
        const ta = document.createElement('textarea');
        ta.onkeydown = function(e) {
            if (e.keyCode === 9 || e.which === 9) {
                e.preventDefault();
                const s = this.selectionStart;
                this.value = this.value.substring(0, this.selectionStart) + '\t' + this.value.substring(this.selectionEnd);
                this.selectionEnd = s + 1;
            }
        };
        this.el.appendChild(ta);
        return this;
    }
}

export default class CoronaView extends View {
    get className() { return 'corona'; }
    render() {
        this.empty();
        //this.playerids = [1,3,5];
        if (this.playerids) {
            const rr = new CoronaRoundView({ playerids: this.playerids });
            this.el.appendChild(rr.render().el);
        } else {
            const spv = new SelectParticipantsView();
            spv.once('start', playerids => {
                this.playerids = playerids;
                this.render();
            });
            this.el.appendChild(spv.render().el);
        }
        return this;
    }
}
