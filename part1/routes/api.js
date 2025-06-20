var express = require('express');
var router = express.Router();
const db = require("../db");


router.get('/dogs', async function (req, res, next) {
    const [rows] = await db.promise().query('SELECT d.name, d.size, u.username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id;');
    return res.json(rows);
});

module.exports = router;
