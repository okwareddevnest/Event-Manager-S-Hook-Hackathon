const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'poiuytr098',
    database: process.env.DB_NAME || 'event_manager_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/add-event', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-event.html'));
});

app.get('/view-event', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'view-event.html'));
});

// API Endpoints
app.get('/api/events', (req, res) => {
    const query = 'SELECT * FROM events ORDER BY event_date ASC';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/events/:id', (req, res) => {
    const query = 'SELECT * FROM events WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(results[0]);
    });
});

app.post('/add-event', (req, res) => {
    const { title, description, event_date } = req.body;
    const query = 'INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)';
    db.query(query, [title, description, event_date], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.redirect('/');
    });
});

app.delete('/api/events/:id', (req, res) => {
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});