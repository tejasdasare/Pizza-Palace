import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { CartContext } from "./CartContext";
import Navigation from "./components/Navigation";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import { getCart, storeCart } from "./helpers";

const App = () => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    getCart().then((cart) => {
      setCart(JSON.parse(cart));
    });
  }, []);

  useEffect(() => {
    storeCart(JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <CartContext.Provider value={{ cart, setCart }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />}></Route>

          <Route path="/products" element={<Products />}></Route>
          <Route
            path="/products/:_id"
            exact
            element={<SingleProduct />}
          ></Route>
          <Route path="/cart" element={<Cart />}></Route>
        </Routes>
      </CartContext.Provider>
    </>
  );
};

export default App;
