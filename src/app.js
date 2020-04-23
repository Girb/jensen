import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('web'));

routes(app);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
