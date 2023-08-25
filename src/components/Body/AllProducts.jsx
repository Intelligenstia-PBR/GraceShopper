import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { fetchAllProducts } from "../../api";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
const Products = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const data = await fetchAllProducts()
      setAllProducts(data)
    }
    getProducts()
  }, [])

  return (
    <div>
      <h1 className="text-center">Products</h1>
      <div className="products">
        {allProducts.map(product => (
          <Card key={product.id} value={product} className="mb-3">
            <Card.Body>
              {/* <Card.Img>{product.photo}</Card.Img> */}
              <Card.Img src={`${product.photo}`} />
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              <Form>
                <Form.Group>
                  <Button>-</Button>
                  {/* <Form.Control type="text"></Form.Control> */}
                  <Button>+</Button>
                </Form.Group>
                <Button>Add to Cart</Button>
                <Button>Add to Wishlist</Button>
              </Form>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
