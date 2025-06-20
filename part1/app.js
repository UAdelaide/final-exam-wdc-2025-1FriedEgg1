var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  try {

    // Create the database if it doesn't exist

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Insert data if table is empty
    await db.execute(`
INSERT INTO Users (username, email, password_hash, role) VALUES ("alice123", "alice@example.com", "hashed123", "owner"), ("bobwalker", "bob@example.com", "hashed456", "walker"), ("carol123", "carol@example.com", "hashed789", "owner"), ("mrsteve", "steve@example.com", "steve123", "walker"), ("steve2", "steve2@example.com", "password", "owner");
      `);
    await db.execute(`
INSERT INTO Dogs (name, size, owner_id) SELECT "Max", "medium", user_id FROM Users WHERE username = 'alice123';
`);
    await db.execute(`
INSERT INTO Dogs (name, size, owner_id) SELECT "Bella", "small", user_id FROM Users WHERE username = 'carol123';
`);
    await db.execute(`
INSERT INTO Dogs (name, size, owner_id) SELECT "Dog1", "large", user_id FROM Users WHERE username = 'bobwalker';
`);
    await db.execute(`
INSERT INTO Dogs (name, size, owner_id) SELECT "Dog2", "medium", user_id FROM Users WHERE username = 'alice123';
`);
    await db.execute(`
INSERT INTO Dogs (name, size, owner_id) SELECT "Dog3", "small", user_id FROM Users WHERE username = 'steve2';
`);
    await db.execute(`
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-10 08:00:00', 30, "Parklands", "open" FROM Dogs WHERE name="Max";
`);
    await db.execute(`
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-10 09:30:00', 45, "Beachside Ave", "accepted" FROM Dogs WHERE name="Bella";
`);
    await db.execute(`
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-11 09:30:00', 10, "Roadside Ave", "accepted" FROM Dogs WHERE name="Dog1";
`);
    await db.execute(`
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-12 07:35:00', 90, "Hospital", "cancelled" FROM Dogs WHERE name="Dog2";
`);
    await db.execute(`
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-14 11:30:00', 55, "Langles House", "accepted" FROM Dogs WHERE name="Dog3";
`);
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT d.name AS dog_name, d.size, u.username AS owner_username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id;');
    return res.json(rows);
  } catch (err) {
    console.error(err);
  }
}
);

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username FROM WalkRequests wr JOIN Dogs d ON wr.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id;');
    return res.json(rows);
  } catch (err) {
    console.error(err);
  }
});

app.get('api/walkers/summary' async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
