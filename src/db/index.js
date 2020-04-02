import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const connectionString = 'postgres://postgres:postgres@localhost:5432/kniksen';
const db = pgp(connectionString);

export default db;