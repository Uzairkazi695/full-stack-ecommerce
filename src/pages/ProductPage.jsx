import { addToCart, removeFromCart, setTotalQty } from "../store/cartSlice";
import service from "../appwrite/config";
import { Button } from "../components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "@/appwrite/auth";

function ProductPage() {
  const [product, setProduct] = useState(null);
  console.log(product);

  const [isAdmin, setIsAdmin] = useState("");
  const { slug } = useParams();
  console.log(slug);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.auth.userData);

  const cart = useSelector((state) => {
    return state.cart.cart;
  });

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
        console.log(res);
        
      const userData = res.labels[0];
      setIsAdmin(userData);
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (slug) {
      service.getListing(slug).then((prod) => {
        console.log(prod);

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

  const cartHandler = () => {
    dispatch(addToCart(product));
    dispatch(setTotalQty());
  };
  const removeCartHandler = () => {
    cart.map((prod) => {
      if (prod.$id === product.$id) {
        dispatch(removeFromCart(prod.id));
        dispatch(setTotalQty());
      } else {
        return prod;
      }
    });
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
          Back
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
                ${product.price}
              </div>
              <div className="text-justify mt-2">{product.description}</div>
              <div className="flex items-center mt-5 gap-5">
                {/* <button onClick={() => decrementQty(productData.id, productData.qty)}>
                  <FaMinus />
                </button>
                <div>{productData.qty}</div>
                <button onClick={() => incrementQty(productData.id, productData.qty)}>
                  <FaPlus />
                </button> */}
              </div>
              {cart.some((prod) => prod.$id === product.$id) ? (
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
