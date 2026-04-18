const Postgres = require('../modules/postgres');

const router = require('express').Router();

router.get("/payload", (req, res) => {
    if (req.query.count && (typeof req.query.count !== 'number' || req.query.count > 100 || req.query.count < 1)) {
        return res.status(400).json({ error: "Count parameter exceeds maximum limit of 100 or is invalid" });
    }
    const count = parseInt(req.query.count) || 5;
    Postgres.getPayloadData(count)
        .then(data => res.json(data))
        .catch(err => {
            console.error("[DATABASE] Error fetching payload data", err);
            res.status(500).json({ error: "Database error" });
        });
});

module.exports = router;