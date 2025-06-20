var express = require('express');
var router = express.Router();
const db = require("../db.js");


/* GET users listing. */
router.get('/dogs', async function (req, res, next) {
    const [rows] = await db.execute('SELECT username, size, owner FROM Dogs JOIN Users ON Dogs.owner_id = Users.user_id')
});

module.exports = router;
