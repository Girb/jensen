import db from '../db/index.js';

const players = {
    getAll(req, res, next) {
        db.any('SELECT * from tbl_slager')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
    }
};

export default players;