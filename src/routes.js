import standings from './api/standings.js';
import game from './api/game.js';

const routes = route => {
    route.get('/', (req, res) => {
        res.send(`Kiegleserver is running (${new Date()}`);
    });

    route.route('/standings/:year')
        .get(standings.byYear);

    route.route('/game/randomround/:participantid')
        .get(game.randomRound);

};

export default routes; 