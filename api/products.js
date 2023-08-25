const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByTitle,
  getProductsByCategory,
  updateProduct,
} = require("../db/models");
const router = express.Router();
const fs = require('fs')
const sharp = require('sharp')

router.post("/", async (req, res, next) => {
  // if (!req.headers.authorization) {
  //   next();
  // }

  const { title, description, price, quantity, category } = req.body;
  const photoFilePath = req.file.path;
  try {
    const uploadedFile = req.files.photo; // Access the uploaded file
    const photoBuffer = fs.readFileSync(uploadedFile.path);
    fs.unlinkSync(uploadedFile.path); // Delete the temporary file
    const newProduct = await createProduct({
      title,
      description,
      price,
      quantity,
      category,
      photo: photoBuffer,
    });

    fs.unlinkSync(photoFilePath)
    res.send(newProduct);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// router.get("/", async (req, res, next) => {
//   try {
//     const products = await getAllProducts();
//     const productsWithResizedImages = await Promise.all(products.map(async (product) => {
//       const smallImageBuffer = await sharp(product.photo)
//         .resize({ width: 100 }) // Adjust the desired width
//         .toBuffer();
//       const smallPhotoBase64 = smallImageBuffer.toString('base64');
//       return { ...product, smallPhoto: smallPhotoBase64 };
//     }));
//     console.log(productsWithResizedImages)
//     res.send(productsWithResizedImages);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/', async (req, res, next) => {
//   try {
//     const products = await getAllProducts();

//     // Convert the base64-encoded photos to data URLs
//     const productsWithImages = products.map(product => ({
//       ...product,
//       photo: `data:image/png;base64,${product.photo}`, // Assuming JPEG format, adjust as needed
//     }));

//     res.json(productsWithImages);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);

    if (product) {
      res.send(product);
    } else {
      res.send({
        error: "ERROR",
        message: `product ${productId} not found`,
        title: "productNotFound",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/products/:productId", async (req, res, next) => {
  if (!req.headers.authorization) {
    next();
  }

  const { productId } = req.params;
  const { title, description, price, quantity, category, photo } = req.body;

  try {
    const product = await getProductById(productId);
    const productTitle = await getProductByTitle(title);

    if (!product) {
      res.send({
        error: "ERROR",
        message: `Product ${productId} not found`,
        title: "ProductNotFound",
      });
    } else if (productTitle && productTitle.title === title) {
      res.send({
        error: "ERROR",
        message: `An Product with  ${title} already exists`,
        title: "ProductAlreadyExists",
      });
    } else {
      const updatedProduct = await updateProduct({
        id: productId,
        title: title,
        description: description,
      });
      res.send(updatedProduct);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/products/:categories", async (req, res, next) => {
  const category = req.params;
  try {
    const product = getProductsByCategory(category);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;