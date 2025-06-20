var express = require('express');
var router = express.Router();
const db = require("../db.js");


/* GET users listing. */
router.get('/dogs', async function (req, res, next) {
    const [rows] = await db.execute('SELECT u.username, d.size, d.owner FROM Dogs d JOIN Users u ON d.owner_id = u.user_id')
});

module.exports = router;
