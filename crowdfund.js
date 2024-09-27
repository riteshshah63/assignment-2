// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");

// Create an Express app
const app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ritesh@2024',  // Update your password if necessary
    database: 'Crowdfunding_db' // Ensure this matches your database name
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to the database.");
});

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JS, Images, HTML)
app.use(express.static(__dirname));

// Route to serve index.html (Home Page)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route to serve fundraiser.html (Fundraiser Search Page)
app.get("/fundraiser", (req, res) => {
    res.sendFile(path.join(__dirname, "fundraiser.html"));
});

// Route to serve category.html (Category Search Page)
app.get("/category", (req, res) => {
    res.sendFile(path.join(__dirname, "category.html"));
});

// 1. GET all active fundraisers (for Fundraiser Search Page or other pages that require this data)
app.get("/fundraisers", (req, res) => {
    const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = TRUE
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching fundraisers: ", err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Return the active fundraisers as JSON
    });
});

// 2. GET all categories (for Category Search Page)
app.get("/categories", (req, res) => {
    const query = "SELECT * FROM CATEGORY";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching categories: ", err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Return categories as JSON
    });
});

// 3. GET category details by ID (to fetch details of a specific category)
app.get("/category/:id", (req, res) => {
    const categoryId = req.params.id;

    const query = `
        SELECT * FROM CATEGORY WHERE CATEGORY_ID = ?
    `;
    
    db.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error("Error fetching category details: ", err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(results[0]); // Return category details
    });
});

// 4. GET fundraiser details by ID (to fetch details of a specific fundraiser)
app.get("/fundraiser/:id", (req, res) => {
    const fundraiserId = req.params.id;

    const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = ?
    `;
    
    db.query(query, [fundraiserId], (err, results) => {
        if (err) {
            console.error("Error fetching fundraiser details: ", err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Fundraiser not found' });
        }
        res.json(results[0]); // Return fundraiser details
    });
});

// Start the server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
