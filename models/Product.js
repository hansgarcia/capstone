const pool = require('../db');

const getProducts = async () => {
  const res = await pool.query('SELECT * FROM products');
  return res.rows;
};

const getProductById = async (id) => {
  const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0];
};

const createProduct = async (product) => {
  const { name, description, price, category, imageUrl } = product;
  const res = await pool.query(
    'INSERT INTO products (name, description, price, category, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, category, imageUrl]
  );
  return res.rows[0];
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
