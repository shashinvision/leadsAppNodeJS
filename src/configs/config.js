import 'dotenv/config'

const config = {
    db: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        supportBigNumbers: true,
        waitForConnections: true,
        connectionLimit: process.env.DB_CONN_LIMIT || 2,
        queueLimit: 0,
        debug: process.env.DB_DEBUG || false,
    },
};
export default config;
