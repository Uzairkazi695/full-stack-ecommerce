import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ProductForm from "./components/producForm/ProductForm.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Cart from "./components/Cart.jsx";
import ProductCart from "./pages/ProductCart.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/add-product",
        element: <ProductForm />,
      },
      {
        path: "/product/:slug",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <ProductCart />,
      },
      {
        path: "/edit-product/:slug",
        element: <EditProduct />,
      },
      {
        path: "/completed",
        element: <PaymentSuccess />,
      },
      {
        path: "/failed",
        element: <PaymentFailure/>,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
