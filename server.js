const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { Sequelize } = require('sequelize');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup Sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql' // or 'postgres', 'sqlite', etc.
});

// Define User model
const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Synchronize models with the database
sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch(error => console.error('Error syncing database:', error));

// Routes

// Fake Store API URLs
const productsUrl = 'https://fakestoreapi.com/products';

// Route to get all products
app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get(productsUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Route to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${productsUrl}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Cart routes (assuming cart is stored locally for simplicity)
let cart = [];

app.post('/api/cart', (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingItemIndex = cart.findIndex(item => item.userId === userId && item.productId === productId);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ userId, productId, quantity });
    }

    res.json({ message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const userCart = cart.filter(item => item.userId === userId);
    res.json(userCart);
});

// Handle root path
app.get('/', (req, res) => {
    res.send('API is running. Use /api/products or /api/cart endpoints.');
});

app.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        console.log('Hashing password...');
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully:', hashedPassword);

        // Save the user to the database
        console.log('Creating user in the database...');
        const user = await User.create({ username, password: hashedPassword });
        console.log('User created successfully:', user);

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
