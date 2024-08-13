import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCart,
  addToCart,
  removeFromCart,
  setTotalQty,
} from "@/store/cartSlice";
import service from "../appwrite/config";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

function ProductCard(prod) {
  const { title, image, price, category, $id } = prod;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const userStatus = useSelector((state) => state.auth.userData);

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
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
      const data = await service.addCartItem(userStatus.$id, $id, 1);
      dispatch(addToCart(data));
      dispatch(setTotalQty());
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      <Link to={`/product/${$id}`}>
        <Card>
          <CardContent>
            <div className="h-1/2 flex justify-center items-center mt-7">
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
        </Card>
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
    </>
  );
}

export default ProductCard;
