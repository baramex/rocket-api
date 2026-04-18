const Postgres = require('../modules/postgres');

const router = require('express').Router();

router.post('/payload/status', (req, res) => {
    const { status } = req.body;
    if (typeof status !== 'number') {
        return res.status(400).json({ error: "Invalid status value" });
    }
    Postgres.pushStatus(status)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error("[DATABASE] Error inserting status", err);
            res.status(500).json({ error: "Database error" });
        });
});

router.post('/payload/location', (req, res) => {
    const { longitude, latitude } = req.body;
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        return res.status(400).json({ error: "Invalid longitude or latitude value" });
    }
    Postgres.pushLocation(longitude, latitude)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error("[DATABASE] Error inserting location", err);
            res.status(500).json({ error: "Database error" });
        });
});

router.post('/payload/motors', (req, res) => {
    const { motor_right, motor_left } = req.body;
    if (typeof motor_right !== 'number' || typeof motor_left !== 'number') {
        return res.status(400).json({ error: "Invalid motor values" });
    }
    Postgres.pushMotors(motor_right, motor_left)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error("[DATABASE] Error inserting motors", err);
            res.status(500).json({ error: "Database error" });
        });
});

router.post('/payload/altitude', (req, res) => {
    const { altitude } = req.body;
    if (typeof altitude !== 'number') {
        return res.status(400).json({ error: "Invalid altitude value" });
    }
    Postgres.pushAltitude(altitude)
        .then(() => res.json({ success: true }))
        .catch(err => {
            console.error("[DATABASE] Error inserting altitude", err);
            res.status(500).json({ error: "Database error" });
        });
});

module.exports = router;