import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  incrementQty,
  decrementQty,
  setTotalQty,
  setTotal,
  removeFromCart,
} from "../store/cartSlice";
import authService from "@/appwrite/auth";
import service from "@/appwrite/config";
import { login } from "@/store/authSlice";
import CheckoutBtn from "@/components/CheckoutBtn";

const Cart = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-8">
            <div className="space-y-4">
              {products.map((product) => {
                const cartItem = cartItems.find(
                  (item) => item.productId === product.$id
                );

                return (
                  <Card key={product.$id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link
                          to={`/product/${product.$id}`}
                          className="shrink-0"
                        >
                          <img
                            src={service.getFilePreview(product.image)}
                            alt={product.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${product.$id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {product.title}
                          </Link>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  dispatch(decrementQty(product.$id));
                                  dispatch(setTotalQty());
                                  dispatch(setTotal());
                                }}
                              >
                                <FaMinus className="w-4 h-4" />
                              </Button>

                              <span className="w-8 text-center font-medium">
                                {cartItem ? cartItem.quantity : 0}
                              </span>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  dispatch(incrementQty(product.$id));
                                  dispatch(setTotalQty());
                                  dispatch(setTotal());
                                }}
                              >
                                <FaPlus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-sm text-gray-500">
                              Unit Price: ₹{product.price}
                            </div>

                            <div className="font-medium text-gray-900">
                              Total: ₹
                              {cartItem &&
                                parseInt(product.price) * cartItem.quantity}
                            </div>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                dispatch(removeFromCart(product.$id));
                                dispatch(setTotalQty());
                                dispatch(setTotal());
                              }}
                            >
                              <RiDeleteBin6Line className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-2xl font-bold text-gray-900">
                    Total: ₹{Math.round(cartTotal * 100) / 100}
                  </div>
                  <div className="w-full sm:w-auto">
                    <CheckoutBtn products={products} cartItems={cartItems} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center p-12">
            <div className="flex flex-col items-center gap-4">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-gray-500">
                Add items to your cart to see them here.
              </p>
              <Link to="/">
                <Button className="mt-4">Continue Shopping</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cart;
