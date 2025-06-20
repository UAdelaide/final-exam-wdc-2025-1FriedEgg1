

var mysql = require('mysql2/promise');

let db;

(async () => {
    try {
        // Connect to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '' // Set your MySQL root password
        });

        // Create the database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
        await connection.end();

        // Now connect to the created database
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });

        // Insert data if table is empty
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
        if (rows[0].count === 0) {
            await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES ("alice123", "alice@example.com", "hashed123", "owner"), ("bobwalker", "bob@example.com", "hashed456", "walker"), ("carol123", "carol@example.com", "hashed789", "owner"), ("mrsteve", "steve@example.com", "steve123", "walker"), ("steve2", "steve2@example.com", "password", "owner");

INSERT INTO Dogs (name, size, owner_id) SELECT "Max", "medium", user_id FROM Users WHERE username = 'alice123';

INSERT INTO Dogs (name, size, owner_id) SELECT "Bella", "small", user_id FROM Users WHERE username = 'carol123';

INSERT INTO Dogs (name, size, owner_id) SELECT "Dog1", "large", user_id FROM Users WHERE username = 'bobwalker';

INSERT INTO Dogs (name, size, owner_id) SELECT "Dog2", "medium", user_id FROM Users WHERE username = 'alice123';

INSERT INTO Dogs (name, size, owner_id) SELECT "Dog3", "small", user_id FROM Users WHERE username = 'steve2';

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-10 08:00:00', 30, "Parklands", "open" FROM Dogs WHERE name="Max";

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-10 09:30:00', 45, "Beachside Ave", "accepted" FROM Dogs WHERE name="Bella";

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-11 09:30:00', 10, "Roadside Ave", "accepted" FROM Dogs WHERE name="Dog1";

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-12 07:35:00', 90, "Hospital", "cancelled" FROM Dogs WHERE name="Dog2";

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) SELECT dog_id, '2025-06-14 11:30:00', 55, "Langles House", "accepted" FROM Dogs WHERE name="Dog3";
      `);
        }
    } catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

module.exports = db;