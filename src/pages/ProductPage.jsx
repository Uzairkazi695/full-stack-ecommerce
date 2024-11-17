"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaEdit,
  FaShoppingCart,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addToCart,
  decrementQty,
  incrementQty,
  removeFromCart,
  setTotal,
  setTotalQty,
} from "../store/cartSlice";
import service from "../appwrite/config";
import authService from "@/appwrite/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState("");
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const userStatus = useSelector((state) => state.auth.userData);
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
    <main className="container mx-auto px-4 py-8">
      <Button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2"
        variant="outline"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      {product ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img
                  src={service.getFilePreview(product.image)}
                  alt={product.title}
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
              <div className="p-6 md:w-3/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                    <Badge variant="secondary" className="text-lg mb-4">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ₹{product.price}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      dispatch(decrementQty(product.$id));
                      dispatch(setTotalQty());
                    }}
                  >
                    <FaMinus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold">
                    {cart.find((prod) => prod.productId === product.$id)
                      ?.quantity || 0}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      dispatch(incrementQty(product.$id));
                      dispatch(setTotalQty());
                    }}
                  >
                    <FaPlus className="w-4 h-4" />
                  </Button>
                </div>
                {cart.some((prod) => prod.productId === product.$id) ? (
                  <Button
                    onClick={removeCartHandler}
                    variant="destructive"
                    className="w-full mb-4"
                  >
                    Remove from cart
                  </Button>
                ) : (
                  <Button onClick={cartHandler} className="w-full mb-4">
                    <FaShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                  </Button>
                )}
                {isAdmin === "admin" && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full mt-4">
                          Delete Product
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product and remove the data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deletePost}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link to={`/edit-product/${product.$id}`}>
                      <Button variant="outline" className="w-full">
                        <FaEdit className="w-4 h-4 mr-2" />
                        Edit Product
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-full md:w-1/2 h-[400px]" />
              <div className="w-full md:w-1/2 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
