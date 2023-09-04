import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts, getProductsByCategory } from "../../api";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Category = ({
  setProductId,
  productId,
  loggedIn,
  category,
  setCategory,
}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await getProductsByCategory(category);
        if (Array.isArray(data)) {
          setProducts(data);
          console.log("CategoryProducts", data);
          console.log("Products, Category", products);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, [category]);

  const handleClick = (proId) => {
    setProductId(proId);
    console.log(productId);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <Row className="products mb-3">
        {products.map((product) => (
          <Col
            key={product.id}
            value={product}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <Card.Body>
              <Card.Img variant="top" src="/images/img-not-found.png" />
              <Link
                to={`/Product/${product.id}`}
                onClick={() => handleClick(product.id)}
              >
                <Card.Title>{product.title}</Card.Title>
              </Link>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              <Button>Add to Cart</Button>
              <Button>Add to Wishlist</Button>
            </Card.Body>
          </Col>
        ))}
      </Row>
    </div>
  );
};
