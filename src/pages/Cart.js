import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";

const Cart = () => {
  let total = 0;

  const { cart, setCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);

  const [priceFetched, setPriceFetched] = useState(false);
  // console.log("helllo", cart);

  const getSum = (productId, price) => {
    const sum = price * getQty(productId);
    total += sum;
    return sum;
  };

  useEffect(() => {
    if (!cart.items) {
      return;
    }

    if (priceFetched) {
      return;
    }

    fetch(`https://ecom-rest-apis.herokuapp.com/api/products/cart-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: Object.keys(cart.items) }),
    })
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
        setPriceFetched(true);
      });
  }, [cart, priceFetched]);

  const getQty = (productId) => {
    return cart.items[productId];
  };

  const increment = (productId) => {
    const oldQty = cart.items[productId];
    const _cart = { ...cart };
    _cart.items[productId] = oldQty + 1;
    _cart.totalItems += 1;
    setCart(_cart);
  };

  const decrement = (productId) => {
    const oldQty = cart.items[productId];
    if (oldQty === 1) {
      return;
    }
    const _cart = { ...cart };
    _cart.items[productId] = oldQty - 1;
    _cart.totalItems -= 1;
    setCart(_cart);
  };

  const handleDelete = (productId) => {
    const _cart = { ...cart };
    const qty = _cart.items[productId];
    delete _cart.items[productId];
    _cart.totalItems -= qty;
    setCart(_cart);

    const updatedProductsList = products.filter(
      (product) => product._id !== productId
    );

    setProducts(updatedProductsList);
  };

  const handleOrderNow = () => {
    window.alert("Order placed succesfully !");
    setProducts([]);
    setCart({});
  };

  return products.length ? (
    <div className="container mx-auto lg:w-1/2 w-full pb-24">
      <h1 className="my-12 font-bold">Cart Items</h1>

      <ul>
        {products.map((product) => {
          return (
            <li className="mb-12" key={product._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="h-16" src={product.image} alt="" />
                  <span className="font-bold ml-4 w-48">{product.name}</span>
                </div>

                <div>
                  <button
                    className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
                    onClick={() => {
                      decrement(product._id);
                    }}
                  >
                    -
                  </button>
                  <b className="px-4">{getQty(product._id)}</b>
                  <button
                    className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
                    onClick={() => {
                      increment(product._id);
                    }}
                  >
                    +
                  </button>
                </div>
                <span>₹ {getSum(product._id, product.price)}</span>

                <button
                  className="bg-red-500 px-4 py-2 rounded-full leading-none text-white"
                  onClick={() => {
                    handleDelete(product._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <hr className="my-6" />

      <div className="text-right font-bold"> Grand Total : ₹ {total} </div>
      <div className="text-right font-bold mt-6">
        <button
          className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
          onClick={handleOrderNow}
        >
          Order Now
        </button>
      </div>
    </div>
  ) : (
    <img
      className="mx-auto w=1/2 mt-12"
      src="/images/empty-cart.png"
      alt="emptyCart"
    />
  );
};

export default Cart;
