const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on("error", (err) => {
    console.error("[DATABASE] Erreur de connexion", err);
});

pool.on("connect", () => {
    console.log("[DATABASE] Connecté à la base de données PostgreSQL");
});

class Postgres {
    static init() {
        pool.query("CREATE TABLE IF NOT EXISTS status (id SERIAL PRIMARY KEY NOT NULL, status SMALLINT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        pool.query("CREATE TABLE IF NOT EXISTS locations (id SERIAL PRIMARY KEY NOT NULL, longitude DOUBLE PRECISION, latitude DOUBLE PRECISION, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        pool.query("CREATE TABLE IF NOT EXISTS motors (id SERIAL PRIMARY KEY NOT NULL, motor_right INTEGER, motor_left INTEGER, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        pool.query("CREATE TABLE IF NOT EXISTS altitudes (id SERIAL PRIMARY KEY NOT NULL, altitude INTEGER, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    }

    static pushStatus(status) {
        return pool.query("INSERT INTO status (status) VALUES ($1) RETURNING id", [status]);
    }

    static pushLocation(longitude, latitude) {
        return pool.query("INSERT INTO locations (longitude, latitude) VALUES ($1, $2) RETURNING id", [longitude, latitude]);
    }

    static pushMotors(motor_right, motor_left) {
        return pool.query("INSERT INTO motors (motor_right, motor_left) VALUES ($1, $2) RETURNING id", [motor_right, motor_left]);
    }

    static pushAltitude(altitude) {
        return pool.query("INSERT INTO altitudes (altitude) VALUES ($1) RETURNING id", [altitude]);
    }

    static getPayloadData(count = 5) {
        return Promise.all([
            pool.query("SELECT * FROM status ORDER BY time DESC LIMIT 1"),
            pool.query("SELECT * FROM locations ORDER BY time DESC LIMIT $1", [count]),
            pool.query("SELECT * FROM motors ORDER BY time DESC LIMIT 1"),
            pool.query("SELECT * FROM altitudes ORDER BY time DESC LIMIT $1", [count])
        ]).then(([statusRes, locationRes, motorsRes, altitudeRes]) => {
            return {
                status: statusRes.rows[0],
                locations: locationRes.rows,
                motors: motorsRes.rows[0],
                altitudes: altitudeRes.rows
            };
        });
    }
}

module.exports = Postgres;