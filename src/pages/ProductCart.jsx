import authService from "@/appwrite/auth";
import service from "@/appwrite/config";
import { login } from "@/store/authSlice";
import {
  incrementQty,
  decrementQty,
  setTotalQty,
  setTotal,
  removeFromCart,
} from "../store/cartSlice"; // Import decrementQty
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import conf from "../conf/conf";
import { Client, Account, Functions, Databases } from "appwrite";
import CheckoutBtn from "@/components/CheckoutBtn";

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

  const order = () => {
    fetch("https://stripepaymentserver-rg1of9u4.b4a.run/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          { id: 1, quantity: 3 },
          { id: 2, quantity: 1 },
        ],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <div>
      <div className="w-screen">
        <h2 className="flex justify-center items-center text-2xl font-bold">
          Your Cart
        </h2>
      </div>
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
              <Link to={`/product/${product.$id}`}>
                <img
                  src={service.getFilePreview(product.image)}
                  alt={product.title}
                  className="max-w-48 h-auto"
                />
              </Link>
              <h3 className="uppercase text-semibold">{product.title}</h3>

              <div className="flex items-center mt-5 gap-5 ml-5 flex-wrap">
                <Button
                  onClick={() => {
                    dispatch(decrementQty(product.$id));
                    dispatch(setTotalQty());
                    dispatch(setTotal());
                  }}
                >
                  <FaMinus />
                </Button>
                <div>{cartItem ? cartItem.quantity : 0}</div>
                <Button
                  onClick={() => {
                    dispatch(incrementQty(product.$id));
                    dispatch(setTotalQty());
                    dispatch(setTotal());
                  }}
                >
                  <FaPlus />
                </Button>
                <p className="text-gray-400 flex justify-center items-center">
                  ₹{product.price}
                </p>
                <p className="flex justify-center items-center">
                  ₹{cartItem && parseInt(product.price) * cartItem.quantity}
                </p>
                <Button
                  onClick={() => {
                    dispatch(removeFromCart(product.$id));
                    dispatch(setTotalQty());
                    dispatch(setTotal());
                  }}
                  className="flex justify-center items-center"
                >
                  <RiDeleteBin6Line />
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="flex flex-col items-center mt-3">
        <div className="flex items-center gap-4 text-lg">
          <div className="font-semibold">
            Total: ₹{Math.round(cartTotal * 100) / 100}
          </div>
        </div>
        <CheckoutBtn products={products} cartItems={cartItems}/>
      </div>
    </div>
  );
}

export default Cart;
