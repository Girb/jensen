import standings from './api/standings.js';
import game from './api/game.js';
import players from './api/players.js';

const routes = route => {
    route.get('/', (req, res) => {
        res.send(`Kiegleserver is running (${new Date()}`);
    });

    route.route('/standings/:year')
        .get(standings.byYear);

    route.route('/game/randomround/:participantid')
        .get(game.randomRound);

    route.route('/game/verifydata')
        .get(game.verifyData);

    route.route('/players')
        .get(players.getAll);


};

export default routes; 