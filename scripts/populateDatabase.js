const axios = require('axios');
const pool = require('../db');

const axios = require('axios');
const pool = require('../db');

const fetchDataAndPopulateDB = async () => {
  try {
    // Fetch products from Fake Store API
    const response = await axios.get('https://fakestoreapi.com/products');
    const products = response.data;

    // Insert products into the PostgreSQL database
    for (const product of products) {
      const { title, description, price, category, image } = product;
      await pool.query(
        'INSERT INTO products (name, description, price, category, imageUrl) VALUES ($1, $2, $3, $4, $5)',
        [title, description, price, category, image]
      );
    }

    console.log('Database populated with products from Fake Store API');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    pool.end();
  }
};

fetchDataAndPopulateDB();
