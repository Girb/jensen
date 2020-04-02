import db from '../db/index.js';

const randomRoundSql = `
    select poengsum
    from tbl_tier
    where slager_id = $1
    and status_id = 1
    order by tier_id asc
    LIMIT 1
    offset (floor(random() * (select count(*) from tbl_tier where slager_id = $1 and status_id = 1) + 1)::int);
`;

const game = {
    randomRound(req, res, net) {
        const participantid = req.params.participantid;
        db.any(randomRoundSql, participantid)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
    }
};

export default game;