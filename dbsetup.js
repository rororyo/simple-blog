import pg from "pg";
import env from "dotenv";
env.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const dbMiddleware = async (req, res, next) => {
    const client = await pool.connect();

    try {
        req.dbClient = client;
        next();
    } catch (error) {
        console.error('Error in middleware:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Ensure the connection is released even if an error occurs
        if (client) {
            client.release();
        }
    }
};
