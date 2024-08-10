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
import { addToCart, removeFromCart } from "@/store/cartSlice";

function ProductCard(prod) {
  const { title, image, price, category, $id } = prod;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  return (
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
            <div className="mt-1">{price}</div>
          </div>
        </CardContent>
        <CardFooter>
          {cart.some((p) => p.id === id) ? (
            <Button onclick={() => dispatch(removeFromCart(prod))}>
              Remove from cart
            </Button>
          ) : (
            <Button onclick={() => dispatch(addToCart(prod))}>
              Add to cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

export default ProductCard;
