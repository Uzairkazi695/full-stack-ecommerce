import {
  addToCart,
  decrementQty,
  incrementQty,
  removeFromCart,
  setTotal,
  setTotalQty,
} from "../store/cartSlice";
import service from "../appwrite/config";
import { Button } from "../components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "@/appwrite/auth";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useToast, toast } from "../components/ui/use-toast";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const userStatus = useSelector((state) => state.auth.userData);

  const [isAdmin, setIsAdmin] = useState("");
  const { slug } = useParams();
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();

      const userData = res.labels[0];
      setIsAdmin(userData);
    }
    getUserData();
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      service.getListing(slug).then((prod) => {
        if (prod) setProduct(prod);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    service.deleteListing(product.$id).then((status) => {
      if (status) {
        service.deleteFile(product.image);
        navigate("/");
      }
    });
  };

  const cartHandler = async () => {
    try {
      const data = await service.addCartItem(
        userStatus.$id,
        product.$id,
        1,
        product.price
      );
      dispatch(addToCart(data));
      dispatch(setTotalQty());
      dispatch(setTotal());
      toast({
        variant: "outline",
        description: "Product added to cart",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeCartHandler = async () => {
    try {
      const itemToRemove = cart.find((item) => item.productId === product.$id);
      if (!itemToRemove) {
        console.error("Item not found in cart.");
        return;
      }

      await service.deleteCartItem(itemToRemove.$id);
      dispatch(removeFromCart(product.$id));
      dispatch(setTotalQty());
      dispatch(setTotal());
      toast({
        description: "Product removed from cart",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <main>
      (
      <>
        <button
          onClick={() => history.back()}
          className="flex justify-center items-center gap-2 ml-5 mt-5 shadow-md w-24 h-10"
        >
          <span>Back</span>
        </button>
        {product ? (
          <div className="flex flex-col items-center md:flex-row w-full">
            <div className="w-64 flex justify-center mx-10 max-h-96 mt-10 md:w-96">
              <img
                src={service.getFilePreview(product.image)}
                alt={product.title}
                className="w-full"
              />
            </div>
            <div className="mt-10 flex flex-col justify-center mx-10 md:ml-20 md:w-1/2 ">
              <div className="text-2xl font-semibold">{product.title}</div>
              <div className="text-lg mt-2">{product.category}</div>
              <div className="text-lg text-[#3c2b20] mt-2">
              ₹{product.price}
              </div>
              <div className="text-justify mt-2">{product.description}</div>
              <div className="flex items-center mt-5 gap-5">
                <button
                  onClick={() => {
                    dispatch(decrementQty(product.$id));
                    dispatch(setTotalQty());
                  }}
                >
                  <FaMinus />
                </button>
                <div>
                  {cart.map(
                    (prod) => prod.productId === product.$id && prod.quantity
                  )}
                </div>
                <button
                  onClick={() => {
                    dispatch(incrementQty(product.$id));
                    dispatch(setTotalQty());
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              {cart.some((prod) => prod.productId === product.$id) ? (
                <Button onClick={removeCartHandler}>Remove from cart</Button>
              ) : (
                <Button onClick={cartHandler}>Add to cart</Button>
              )}
            </div>
          </div>
        ) : (
          <h2>Loading.....</h2>
        )}
      </>
      )
    </main>
  );
}

export default ProductPage;
