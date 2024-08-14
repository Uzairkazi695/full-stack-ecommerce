import authService from "@/appwrite/auth";
import service from "@/appwrite/config";
import { login } from "@/store/authSlice";
import { incrementQty, decrementQty, setTotalQty } from "../store/cartSlice"; // Import decrementQty
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function Cart() {
  const dispatch = useDispatch();
  const [userProductIds, setUserProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const cartItems = useSelector((state) => state.cart.cart);
  console.log(cartItems);

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
  // console.log("hell");

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
          // Find the corresponding cart item to get the quantity
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
              <button onClick={() => {
                dispatch(decrementQty(product.$id))
                dispatch(setTotalQty())
              }}>
                <FaMinus />
              </button>
              <div>{cartItem ? cartItem.quantity : 0}</div>
              <button onClick={() => {
                dispatch(incrementQty(product.$id))
                dispatch(setTotalQty())
              }}>
                <FaPlus />
              </button>
              <p>Price: ₹{product.price}</p>
              <p>
                Total Price: ₹
                {product.price * (cartItem ? cartItem.quantity : 0)}
              </p>
            </div>
          );
        })
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
