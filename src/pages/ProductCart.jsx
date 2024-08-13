import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQty } from "@/store/cartSlice"; // Adjust path

function Cart() {
  const dispatch = useDispatch();
  const [userProductIds, setUserProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const prodQty = useSelector((state) => state.cart.cart);
  
  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
      if (res) {
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

  const handleIncrementQty = (productId, currentQty) => {
    const newQty = currentQty + 1;
    dispatch(updateCartItemQty({ userId: /* current userId */, productId, qty: newQty }));
  };

  const handleDecrementQty = (productId, currentQty) => {
    const newQty = currentQty - 1;
    if (newQty > 0) {
      dispatch(updateCartItemQty({ userId: /* current userId */, productId, qty: newQty }));
    } else {
      // Optional: Handle item removal if quantity becomes 0
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {products.length > 0 ? (
        products.map((product) => (
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
            <button onClick={() => handleDecrementQty(product.$id, product.qty)}>
              <FaMinus />
            </button>
            <div>{product.qty}</div>
            <button onClick={() => handleIncrementQty(product.$id, product.qty)}>
              <FaPlus />
            </button>
            <p>Price: ₹{product.price}</p>
            <p>Total Price: ₹{product.price * product.qty}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
