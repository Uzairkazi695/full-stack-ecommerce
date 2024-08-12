import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import service from "../appwrite/config";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setTotalQty, removeFromCart } from "@/store/cartSlice";
import authService from "../appwrite/auth";
import { useEffect, useState } from "react";

function ProductCard(prod) {
  const { title, image, price, category, $id } = prod;
  const dispatch = useDispatch();
  const cart = useSelector((state) => {
    return state.cart.cart;
  });

  console.log([cart]);

  const [userData, setUserData] = useState("");
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
      const userData = res.$id;
      setUserData(userData);
    }
    getUserData();
  }, []);

  const cartHandler = async () => {
    try {
      await service.addCartItem(userData, prod.$id, prod.qty);
      dispatch(addToCart(prod));
      dispatch(setTotalQty());
      setHasAddedToCart(true);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const checkIfDocumentExists = async (id) => {
    try {
      await service.getCartItems(id);
      return true;
    } catch (error) {
      if (
        error.message.includes(
          "Document with the requested ID could not be found"
        )
      ) {
        return false;
      }
      throw error;
    }
  };
  const removeCartHandler = async () => {
    try {
      // Filter the items that match and remove them
      const itemsToRemove = cart.filter((prod) => prod.$id === $id);

      const itemExists = await checkIfDocumentExists($id);
      if (!itemExists) {
        console.error("Item not found in database.");
        return;
      }
      // Process all the removals concurrently
      await Promise.all(
        itemsToRemove.map(async (prod) => {
          await service.deleteCartItem(prod.productId);
          dispatch(removeFromCart(prod.id));
        })
      );
      console.log("item removed from the cart");

      // Update the total quantity
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
            <div className=" h-1/2  flex justify-center items-center mt-7">
              <img
                src={service.getFilePreview(image)}
                alt={title}
                className=" max-h-40 hover:scale-110 transition duration-300 ease-in-out"
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
      {cart.some((prod) => prod.$id === $id) ? (
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
