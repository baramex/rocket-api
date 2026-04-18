require('dotenv').config();

const express = require('express');
const Postgres = require('./modules/Postgres');
const cors = require('cors');
const app = express();
const port = 1241;

app.listen(port, () => {
    console.log(`[API] Server is running on port ${port}`);
});

Postgres.init();

app.use(cors({ origin: ['https://rocket.baramex.me', 'http://localhost:3000'], credentials: true }));

app.use((req, res, next) => {
    if (req.method === "POST") {
        const key = req.headers.authorization?.split(" ")[1];
        if (key !== process.env.POST_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    next();
});

app.use(express.json());

app.use(require('./routes/post'));
app.use(require('./routes/get'));