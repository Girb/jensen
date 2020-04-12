import db from '../db/index.js';
import { series } from '../data.js';

const randomRoundSql = `
    select poengsum, dato, etternavn, nick
    from tbl_tier t
    inner join tbl_slagning s on t.slagning_id = s.slagning_id
    inner join tbl_slager sl on t.slager_id = sl.slager_id
    where t.slager_id = $1
    and t.status_id = 1
    order by tier_id asc
    LIMIT 1
    offset (floor(random() * (select count(*) from tbl_tier where tbl_tier.slager_id = $1 and status_id = 1) + 1)::int);
`;
 
const game = {
    randomRound(req, res, next) {
        const participantid = req.params.participantid;
        db.any(randomRoundSql, participantid)
        .then(data => {
            const total = data[0].poengsum;
            const rnd = Math.floor(Math.random() * 4);
            const scores = series[total] ? series[total][rnd] : [];
            res.json({
                total,
                scores,
                date: data[0].dato,
                etternavn: data[0].etternavn,
                nick: data[0].nick
            });
        })
        .catch(err => {
            console.log(err);
        });
    },
    verifyData(req, res, next) {
        const msgs = [];
        Object.keys(series).forEach(s => {
            const score = parseInt(s);
            for (let i = 0; i < 4; i++) {
                const sum = series[s][i].reduce((sum, x) => sum + x);
                if (sum !== score) {
                    msgs.push('Score ' + s + ': res ' + i + ' is ' + sum);
                }
            }
        });
        res.json(msgs);
    }
};

export default game;