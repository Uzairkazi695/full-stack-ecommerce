import authService from "@/appwrite/auth";
import service from "@/appwrite/config";
import { login } from "@/store/authSlice";
import {
  incrementQty,
  decrementQty,
  setTotalQty,
  setTotal,
} from "../store/cartSlice"; // Import decrementQty
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function Cart() {
  const dispatch = useDispatch();
  const [userProductIds, setUserProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const cartItems = useSelector((state) => state.cart.cart);
  const cartTotal = useSelector((state) => state.cart.totalAmount);

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
      if (res) {
        dispatch(login(res));
        const userCartItems = await service.getCartItems(res.$id);
        const userCartProductIds = userCartItems.documents.map(
          (prod) => prod.productId
        );
        setUserProductIds(userCartProductIds);
      }
    }
    getUserData();
  }, [dispatch]);
  console.log("products", products);
  console.log("cart", cartItems);

  useEffect(() => {
    async function fetchProducts() {
      const productData = await service.getListings([]);
      const allProducts = productData.documents;

      const filteredProducts = allProducts.filter((prod) =>
        userProductIds.includes(prod.$id)
      );

      setProducts(filteredProducts);
    }

    if (userProductIds.length > 0) {
      fetchProducts();
    }
  }, [userProductIds]);

  return (
    <div>
      <h2>Cart</h2>
      {products.length > 0 ? (
        products.map((product) => {
          const cartItem = cartItems.find(
            (item) => item.productId === product.$id
          );

          return (
            <div
              key={product.$id}
              className="mt-5 ml-3 flex flex-col items-center sm:flex-row"
            >
              <div>
                <img
                  src={service.getFilePreview(product.image)}
                  alt={product.title}
                  className="max-w-48 h-auto"
                />
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <button
                onClick={() => {
                  dispatch(decrementQty(product.$id));
                  dispatch(setTotalQty());
                  dispatch(setTotal());
                }}
              >
                <FaMinus />
              </button>
              <div>{cartItem ? cartItem.quantity : 0}</div>
              <button
                onClick={() => {
                  dispatch(incrementQty(product.$id));
                  dispatch(setTotalQty());
                  dispatch(setTotal());
                }}
              >
                <FaPlus />
              </button>
              <p>Price: ₹{product.price}</p>
              <p>Total Price: ₹{parseInt(product.price) * cartItem.quantity}</p>
            </div>
          );
        })
      ) : (
        <p>Your cart is empty.</p>
      )}
      <p>Total : {cartTotal}</p>
    </div>
  );
}

export default Cart;
