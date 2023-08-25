const client = require("../client");
const fs = require('fs')

async function createProduct({
  title,
  description,
  price,
  quantity,
  category,
  photo,
}) {
  try {

    const photoBinaryInfo = Buffer.from(photo, 'base64')
    const {
      rows: [product],
    } = await client.query(
      `
  INSERT INTO products (title, description, price, quantity, category, photo)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `,
      [title, description, price, quantity, category, photoBinaryInfo]
    );
    return product;
  } catch (error) {
    console.error(error)
  }
}

// async function getAllProducts() {
//   try {
//     const { rows: products } = await client.query(`
//         SELECT products.*
//         FROM products;
//         `);

//     return products
//   } catch (error) {
//     console.error(error);
//   }
// }

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
      SELECT id, title, description, price, quantity, category, encode(photo, 'base64') AS photo
      FROM products;
    `);

    // Convert the photo data to Base64 strings

    const productsWithBase64Images = products.map(product => ({
      ...product,
      photo: product.photo.toString('utf-8')
    }))
    return productsWithBase64Images;
  } catch (error) {
    console.error(error);
  }
}


async function getProductById({ id }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        SELECT products.*
        FROM products
        WHERE id = $1;
        `,
      [id]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductByTitle({ title }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
          SELECT products.*
          FROM products
          WHERE title = $1;
          `,
      [title]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductsByCategory({ category }) {
  try {
    const { rows: products } = await client.query(
      `
          SELECT products.*
          FROM products
          WHERE category = $1;
          `,
      [category]
    );
    return products;
  } catch (error) {
    throw error;
  }
}

async function updateProduct({ id, ...fields }) {
  try {
    const string = Object.keys(fields)
      .map(
        (key, index) =>
          `"${key}" = $${index + 1}
    `
      )
      .join(", ");

    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET ${string} 
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );
    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByTitle,
  getProductsByCategory,
  updateProduct,
};
