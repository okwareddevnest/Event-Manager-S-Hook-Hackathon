const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
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
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/add-event', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-event.html'));
});

app.get('/edit-event/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit-event.html'));
});

app.get('/view-event', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'view-event.html'));
});

// API Endpoints
app.get('/api/categories', (req, res) => {
    const categories = [
        { name: 'Conference', color_code: '#4A90E2' },
        { name: 'Workshop', color_code: '#50E3C2' },
        { name: 'Seminar', color_code: '#F5A623' },
        { name: 'Networking', color_code: '#7ED321' },
        { name: 'Social', color_code: '#D0021B' },
        { name: 'Concert', color_code: '#9013FE' },
        { name: 'Exhibition', color_code: '#4A4A4A' },
        { name: 'Sports', color_code: '#F8E71C' }
    ];
    res.json(categories);
});

app.get('/api/events', (req, res) => {
    const searchQuery = req.query.search;
    let query = 'SELECT * FROM events';
    let params = [];

    if (searchQuery) {
        query = `
            SELECT * FROM events 
            WHERE title LIKE ? 
            OR description LIKE ? 
            OR location LIKE ?
            OR category LIKE ?
        `;
        const searchTerm = `%${searchQuery}%`;
        params = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    query += ' ORDER BY event_date ASC';

    db.query(query, params, (err, results) => {
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
    const { 
        title, 
        description, 
        event_date,
        event_time,
        location,
        image_url,
        category,
        max_attendees,
        organizer_name,
        organizer_email,
        ticket_price,
        is_featured
    } = req.body;

    // Validate required fields
    if (!title || !description || !event_date || !event_time || !location || !category) {
        return res.status(400).json({ 
            success: false,
            error: 'Missing required fields' 
        });
    }

    // Handle image upload
    let finalImageUrl = image_url;
    if (image_url && image_url.startsWith('data:image')) {
        try {
            // Convert base64 to file and save
            const imageData = image_url.split(';base64,').pop();
            const imageType = image_url.split(';')[0].split('/')[1];
            const imageName = `${Date.now()}.${imageType}`;
            const imagePath = path.join(__dirname, 'public', 'uploads', imageName);
            
            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(__dirname, 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });
            finalImageUrl = `/uploads/${imageName}`;
        } catch (error) {
            console.error('Error saving image:', error);
            return res.status(500).json({ 
                success: false,
                error: 'Error saving image' 
            });
        }
    }

    const query = `
        INSERT INTO events (
            title, description, event_date, event_time, location, 
            image_url, category, max_attendees, organizer_name, 
            organizer_email, ticket_price, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title, 
        description, 
        event_date,
        event_time,
        location,
        finalImageUrl,
        category,
        max_attendees || 0,
        organizer_name || 'Anonymous',
        organizer_email || 'no-email@provided.com',
        ticket_price || 0.00,
        is_featured === 'on' ? true : false
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false,
                error: 'Database error occurred' 
            });
        }
        res.status(201).json({ 
            success: true, 
            id: result.insertId,
            message: 'Event created successfully'
        });
    });
});

app.delete('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    
    // First get the event to check if it has an image
    db.query('SELECT image_url FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Delete the event from database
        db.query('DELETE FROM events WHERE id = ?', [eventId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            // If event had an image, delete it from the uploads directory
            if (results[0] && results[0].image_url) {
                const imagePath = path.join(__dirname, 'public', results[0].image_url);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.json({ success: true });
        });
    });
});

app.put('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    const { 
        title, 
        description, 
        event_date,
        event_time,
        location,
        image_url,
        category,
        max_attendees,
        organizer_name,
        organizer_email,
        ticket_price,
        is_featured
    } = req.body;

    // Validate required fields
    if (!title || !description || !event_date || !event_time || !location || !category) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    // Handle image upload
    let finalImageUrl = image_url;
    if (image_url && image_url.startsWith('data:image')) {
        // First, get the old image URL to delete it
        db.query('SELECT image_url FROM events WHERE id = ?', [eventId], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            // Delete old image if it exists
            if (results[0] && results[0].image_url) {
                const oldImagePath = path.join(__dirname, 'public', results[0].image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Save new image
            const imageData = image_url.split(';base64,').pop();
            const imageType = image_url.split(';')[0].split('/')[1];
            const imageName = `${Date.now()}.${imageType}`;
            const imagePath = path.join(__dirname, 'public', 'uploads', imageName);
            
            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(__dirname, 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });
            finalImageUrl = `/uploads/${imageName}`;

            // Update event with new image
            updateEvent(finalImageUrl);
        });
    } else {
        // Update event without changing the image
        updateEvent(finalImageUrl);
    }

    function updateEvent(imageUrl) {
        const query = `
            UPDATE events 
            SET title = ?, 
                description = ?, 
                event_date = ?,
                event_time = ?,
                location = ?,
                image_url = ?,
                category = ?,
                max_attendees = ?,
                organizer_name = ?,
                organizer_email = ?,
                ticket_price = ?,
                is_featured = ?
            WHERE id = ?
        `;

        const values = [
            title,
            description,
            event_date,
            event_time,
            location,
            imageUrl,
            category,
            max_attendees || 0,
            organizer_name || 'Anonymous',
            organizer_email || 'no-email@provided.com',
            ticket_price || 0.00,
            is_featured === 'on' ? true : false,
            eventId
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Event not found' });
                return;
            }

            res.json({ success: true });
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});