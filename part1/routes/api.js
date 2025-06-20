var express = require('express');
var router = express.Router();
const db = require("../db.js");


/* GET users listing. */
router.get('/dogs', async function (req, res, next) {
    const [rows] = await db.execute('SELECT name, size, owner FROM Dogs JOIN Users')
});

module.exports = router;
