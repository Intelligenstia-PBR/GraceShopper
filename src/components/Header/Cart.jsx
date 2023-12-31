import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  removeItemFromCart,
  addItemToCart,
  updateCartItem,
} from "../../apiCalls";
import { Navigate, useNavigate } from "react-router";


export const Cart = ({
  token,
  isLoggedIn,
  cart,
  setCart,
  guestCart,
  setGuestCart,
  storedGuestSessionId,
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [guestTotalCost, setGuestTotalCost] = useState(0);
  const [productQuantities, setProductQuantities] = useState({});
  // const [inCart, setInCart] = useState({});
  const navigate = useNavigate()
  console.log('CART FRONT END CART PAGE:', cart)
  useEffect(() => {
    const storageKey = isLoggedIn ? "cart" : "guestCart";
    localStorage.setItem(
      storageKey,
      JSON.stringify(isLoggedIn ? cart : guestCart)
    );

    // calculate total cost based on whether the user is logged in or not
    const cost = (isLoggedIn ? cart : guestCart).reduce(
      (total, product) => {
        const productSubtotal = product.productInfo.price * product.quantity;
        return total + productSubtotal;
      },
      0
    );

    if (isLoggedIn) {
      setTotalCost(cost);
    } else {
      setGuestTotalCost(cost); // to update guest cart total cost
    }
  }, [cart, guestCart, isLoggedIn]);

  useEffect(() => {
    const storageKey = isLoggedIn ? "cart" : "guestCart";
    const storedCart = localStorage.getItem(storageKey);

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      isLoggedIn ? setCart(parsedCart) : setGuestCart(parsedCart);
    }
  }, [isLoggedIn, setCart, setGuestCart]);

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    // const storedInCart = localStorage.getItem("inCart");

    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }

    // if (storedInCart) {
    //   setInCart(JSON.parse(storedInCart));
    // }
  }, []);

  // comment!
  // useEffect(() => {
  //   // Initialize a new 'inCart' object

  //   const newInCart = {};

  //   // Update 'inCart' based on the contents of the user cart
  //   for (const item of cart) {
  //     newInCart[item.productId] = true;
  //   }

  //   // Update 'inCart' based on the contents of the guest cart
  //   if (storedGuestSessionId) {
  //     for (const item of guestCart) {
  //       newInCart[item.productId] = true;
  //     }
  //   }

  //   // Set the updated 'inCart' state
  //   setInCart(newInCart);
  // }, [cart, guestCart, storedGuestSessionId]);

  // comment!
  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);

  // useEffect(() => {
  //   localStorage.setItem("inCart", JSON.stringify(inCart));
  // }, [inCart]);


  const handleAddOneItemToCart = async (productId) => {
    const updatedQuantity = (productQuantities[productId] || 1) + 1; // Start with a default of 1
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: updatedQuantity,
    }));

    try {
      let updatedCart;

      if (token) {
        updatedCart = await updateCartItem(
          token,
          null,
          productId,
          updatedQuantity
        );
        setCart(updatedCart);
      } else if (storedGuestSessionId) {
        updatedCart = await updateCartItem(
          null,
          storedGuestSessionId,
          productId,
          updatedQuantity
        );
        console.log('UPDATED CART:', updatedCart)
        setGuestCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    try {
      const currentQuantity = productQuantities[productId] || 0;
      let updatedCart;

      if (currentQuantity >= 0) {
        const updatedQuantity = currentQuantity - 1;

        setProductQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: updatedQuantity,
        }));

        if (storedGuestSessionId) {
          updatedCart = await updateCartItem(
            null,
            storedGuestSessionId,
            productId,
            updatedQuantity
          );
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await updateCartItem(
            token,
            null,
            productId,
            updatedQuantity
          );
          setCart(updatedCart);
        }


        // If the updated quantity is zero, remove the product from the cart
        // if (updatedQuantity === 0) {
        //   setInCart((prevInCart) => {
        //     const updatedInCart = { ...prevInCart };
        //     delete updatedInCart[productId];
        //     return updatedInCart;
        //   });
        // }
      }
    } catch (error) {
      console.error(
        "Error handling item quantity or removing item from cart:",
        error
      );
    }
  };

  const handleCheckout = () => {
    if (token) {
      navigate('/checkout')
    } else {
      navigate('/register')
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <h1>Items in your cart:</h1>
      ) : (
        <p>Guest cart:</p>
      )}
      {isLoggedIn && cart.length > 0 ? (
        cart.map((currentProduct) => {
          if (currentProduct.quantity > 0) {
            return (
              <div key={currentProduct.productId}>
                <h2>{currentProduct.productInfo.title}</h2>
                <h4>Price: ${currentProduct.productInfo.price}</h4>
                <h4>Quantity: {currentProduct.quantity}</h4>
                <h4>
                  Subtotal: $
                  {currentProduct.productInfo.price *
                    currentProduct.quantity}
                </h4>
                <Button
                  onClick={() => {
                    console.log('Clicked productId:', currentProduct.productId);
                    handleAddOneItemToCart(currentProduct.productId)
                  }}>
                  +
                </Button>
                <Button
                  onClick={() =>
                    handleDeleteOneItemFromCart(currentProduct.productId)
                  }
                >
                  -
                </Button>
              </div>
            );
          } else {
            return null; // Don't render products with quantity zero
          }
        })
      ) : (
        isLoggedIn && <h1>There are no items in your cart!</h1>
      )}
      {!isLoggedIn &&
        guestCart.length > 0 &&
        guestCart.map((currentProduct) => {
          if (currentProduct.quantity > 0) {
            return (
              <div key={currentProduct.productId}>
                <h1>{currentProduct.productInfo.title}</h1>
                <h2>Price: ${currentProduct.productInfo.price}</h2>
                <h2>Quantity: {currentProduct.quantity}</h2>
                <h2>
                  Subtotal: $
                  {currentProduct.productInfo.price *
                    currentProduct.quantity}
                </h2>
                <Button
                  onClick={() =>
                    handleAddOneItemToCart(currentProduct.productId)
                  }>
                  +
                </Button>
                <Button
                  onClick={() =>
                    handleDeleteOneItemFromCart(currentProduct.productId)
                  }>
                  -
                </Button>
              </div>
            );
          } else {
            return null; // Don't render products with quantity zero
          }
        })}
      {!isLoggedIn && guestCart.length === 0 && (
        <h1>Guest cart is empty.</h1>
      )}
      {isLoggedIn && cart.length > 0 && (
        <h1>Total: ${totalCost}</h1>
      )}
      {!isLoggedIn &&
        guestCart.length > 0 && (
          <h1>Total: ${guestTotalCost}</h1>
        )}
      <Button variant="primary" onClick={(handleCheckout)}>Checkout</Button>
    </div>
  );
};