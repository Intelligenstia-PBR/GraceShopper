const {
  createUser,
  getAllUsers,
} = require("./models/user");
const {
  createProduct, getAllProducts
} = require("./models/products")
const client = require("./client");

async function createTables() {
  console.log("Starting to build tables...");
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        photo BYTEA
      );
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),        
        "productId" INTEGER REFERENCES products(id)
      );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        body TEXT NOT NULL
      );
      `);
    console.log("Tables Created!");
  } catch (error) {
    console.log("Error creating tables");
    throw error;
  }
}

async function dropTables() {
  console.log("Dropping All Tables...");
  try {
    await client.query(`
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log("Tables Dropped!");
  } catch (error) {
    console.log("Error droping tables");
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...")
  try {
    const newUsers = [
      { email: "sheryl123@gmail.com", username: "sheryl", password: "badgyalsheryl1", isAdmin: false },
      { email: "lani@gmail.com", username: "lani", password: "banana246", isAdmin: false },
      { email: "roberto1@gmail.com", username: "roberto", password: "iluvicecream", isAdmin: false }
    ]

    const users = await Promise.all(newUsers.map(createUser))

    const newAdmin = [
      { email: "jimmy1@gmail.com", username: "jimmy", password: "jimmyjam", isAdmin: true },
      { email: "danny234@gmail.com", username: "danny", password: "dan2kool", isAdmin: true },
      { email: "tony24@gmail.com", username: "tony", password: "tonydaboss", isAdmin: true }
    ]

    const adminUsers = await Promise.all(newAdmin.map(createUser))

    console.log("Users created:")
    console.log(users)
    console.log("Finished creating users!")
    console.log("Admin users created:")
    console.log(adminUsers)
    console.log("Finished creating admin users!")
  } catch (error) {
    console.error("Error creating users!")
    throw error
  }
}

async function getInitialUsers() {
  console.log("Starting to get initial users...")
  try {
    const allUsers = await getAllUsers()

    console.log("All users:")
    console.log(allUsers)
    console.log("Finished getting all users!")
  } catch (error) {
    console.error("Error getting users!")
  }
}

async function createInitialProducts() {
  console.log("Starting to create products...")
  try {
    const newProducts = [
      {
        title: "Argan Oil",
        description: "Premium moroccan argan oil that brings shine back to dull hair!",
        price: 24,
        quantity: 5000,
        category: "Moisturizing Oils",
        photo: "C:\\Users\\kierr\\OneDrive\\Pictures\\8-hEd4Ww5iiMDh0PA.png"
      },
      // {
      //   title: "Coconut and Tea Tree Oil",
      //   description: "Premium scalp oil!",
      //   price: 24,
      //   quantity: 5000,
      //   category: "Scalp Oils",
      //   photo: 'placeholder'
      // },
      // {
      //   title: "Vegan and Non-GMO Oil",
      //   description: "Premium vegan and non-GMO oil!",
      //   price: 24,
      //   quantity: 5000,
      //   category: "Vegan Oils",
      //   photo: 'placeholder!'
      // }
    ]

    const products = await Promise.all(newProducts.map(createProduct))
    console.log("Products:")
    console.log(products)
    console.log("Finished creating products!")
  } catch (error) {
    console.error("Error creating products!")
  }
}

async function getInitialProducts() {
  console.log("Starting to get initial products...")
  try {
    const allProducts = await getAllProducts()

    console.log("All products:")
    console.log(allProducts)
    console.log("Finished getting all products!")
  } catch (error) {
    console.error("Error getting products!")
  }
}
async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    //add in create intial stuff for testing when avalible
    await createInitialUsers()
    await getInitialUsers()
    await createInitialProducts()
    await getInitialProducts()
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
  dropTables,
  createTables,
};
