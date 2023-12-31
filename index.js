import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./api/index.js";
import path from "path";
import client from "./db/client.js";
// import { admin, adminRouter } from './App.js';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51NioUWB9h1tasC0ynwIfN6UfPnghz51GPnbWtbY5flyQZJ1x6yV0Rrcw1fE570OjqlNYCLBu6h1alrxWG5dAARU900mhyvNpTz')

dotenv.config();
// This is the Web Server
const server = express();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

server.use(cors()); // Enable CORS first
server.use(morgan("dev")); // Logging
server.use(express.json()); // JSON parsing
server.use("/static", express.static(path.join(__dirname, "build"))); // Static files

// here's our API
server.use("/api", apiRouter);

// adminJs
// server.use("admin", adminRouter)

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// connect to the server
const PORT = process.env.PORT || 4000;

// define a server handle to close open tcp connection after unit tests have run
const handle = server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});

// export server and handle for routes/*.test.js
export { server, handle };
