import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCart,
  addToCart,
  removeFromCart,
  setTotalQty,
  setTotal,
} from "@/store/cartSlice";
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

import service from "../appwrite/config";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useToast, toast } from "./ui/use-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

function ProductCard(prod) {
  const { title, image, price, category, $id } = prod;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const userStatus = useSelector((state) => state.auth.userData);
  const [isAdmin, setIsAdmin] = useState("");
  const { toast } = useToast();
  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
      setIsAdmin(res.labels[0]);

      if (res) {
        dispatch(login(res));
        const userCartItems = await service.getCartItems(res.$id);
        if (userCartItems) dispatch(setCart(userCartItems.documents));
      }
    }
    getUserData();
  }, [dispatch]);

  const cartHandler = async () => {
    try {
      const data = await service.addCartItem(userStatus.$id, $id, 1, price);
      dispatch(addToCart(data));
      dispatch(setTotalQty());
      dispatch(setTotal());

      toast({
        variant: "outline",
        description: "Product added to cart",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const removeCartHandler = async () => {
    try {
      const itemToRemove = cart.find((item) => item.productId === $id);
      if (!itemToRemove) {
        console.error("Item not found in cart.");
        return;
      }

      await service.deleteCartItem(itemToRemove.$id);
      dispatch(removeFromCart($id));
      dispatch(setTotalQty());
      dispatch(setTotal());
      toast({
        description: "Product removed from cart",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const deleteListing = async () => {
    return await service.deleteListing(prod.$id);
  };

  return (
    <>
      <Card className="relative bg-primary-foreground">
        {isAdmin === "admin" && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute top-2 right-2 cursor-pointer"
                >
                  <RiDeleteBin6Line />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your listing and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteListing}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        <Link to={`/product/${$id}`}>
          <CardContent>
            <div className="h-1/2 flex justify-center items-center mt-7 relative">
              <img
                src={service.getFilePreview(image)}
                alt={title}
                className="max-h-40 hover:scale-110 transition duration-300 ease-in-out"
              />
            </div>
            <div className="ml-3 mt-1">
              <div className="mt-8">{category}</div>
              <div className="text-xl font-semibold truncate">{title}</div>
              <div className="mt-1">₹{price}</div>
            </div>
          </CardContent>
        </Link>
        {cart.some((prod) => prod.productId === $id) ? (
          <CardFooter>
            <Button onClick={removeCartHandler}>Remove from cart</Button>
          </CardFooter>
        ) : (
          <CardFooter>
            <Button onClick={cartHandler}>Add to cart</Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

export default ProductCard;
