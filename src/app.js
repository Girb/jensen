import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
