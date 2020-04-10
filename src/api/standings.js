import db from '../db/index.js';

const tablesql = `
    SELECT sl.etternavn, sl.nick, round(avg(poengsum)::numeric, 2) as snitt, count(poengsum) / 2 as turnup, 0 as "turnupPoints", 0 as "avgPoints"
    FROM tbl_tier t
    INNER JOIN tbl_slagning s on t.slagning_id = s.slagning_id
    INNER JOIN tbl_slager sl on t.slager_id = sl.slager_id
    WHERE t.status_id = 1
    AND s.status_id = 1
    AND EXTRACT(YEAR from s.dato) = $1
    GROUP BY sl.etternavn, sl.nick
    ORDER BY turnup desc, snitt desc, etternavn asc;
`;

// tbl is already sorted by turnup
const setTotals = tbl => {
    let num1 = 12, num2 = 12, num3 = -1.0;
    tbl.forEach(current => {
        if (parseInt(current.turnup) >= 5) {
            if (num3 !== current.turnup) {
                num1 = num2;
            }
            num2--;
            current.turnupPoints = num1;
            num3 = current.turnup;
        }
    });
    num1 = 12;
    num2 = 12;
    num3 = -1.0;
    tbl
        .sort((x, y) => parseFloat(y.snitt) - parseFloat(x.snitt))
        .forEach(current => {
            if (parseInt(current.turnup) >= 5) {
                if (num3 !== current.snitt) {
                    num1 = num2;
                }
                num2--;
                current.avgPoints = num1;
                num3 = current.snitt;
            }
        });
    tbl.forEach(current => current.totalPoints = (current.avgPoints + current.turnupPoints));
    return tbl.sort((x, y) => y.totalPoints - x.totalPoints );
};

const standings = {
    byYear(req, res, next) {
        const year = req.params.year;
        db.any(tablesql, year)
        .then(data => {
            res.json(setTotals(data));
        })
        .catch(err => {
            console.log(err);
        });
    }        
};

export default standings;
