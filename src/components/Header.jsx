import React, { useEffect, useState } from "react";
import { IoBagHandleSharp } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModeToggle } from "./mode-toggle";
import service from "../appwrite/config";
import authService from "../appwrite/auth";
import { login, logout } from "../store/authSlice";
import { setTotalQty } from "@/store/cartSlice";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  const totalQty = useSelector((state) => state.cart.totalQty);

  const authStatus = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await authService.logout().then(() => dispatch(logout));
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    async function getUserData() {
      const res = await authService.getCurrentUser();
      setIsAdmin(res.labels[0]);
      if (res) dispatch(login(res));
      setUserData(res.$id);
      dispatch(setTotalQty());
    }
    getUserData();
  }, [dispatch]);

  return (
    <>
      <header className="w-full h-20 bg-[#FDF8EB]  flex justify-between sticky top-0 shadow-md z-20">
        <Link to={""} className="flex">
          <span className="absolute h-full ml-10 mr-[5rem] ">LOGO</span>
        </Link>
        <div className="text-[#5d5048] text-lg font-medium flex md:mr-28">
          <ul className="hidden md:flex gap-7 items-center ">
            <li>
              <Link to={""}>Home</Link>
            </li>
            <li>
              <Link>Products</Link>
            </li>

            {isAdmin === "admin" && (
              <li>
                <Link to={"add-product"}>Add Product</Link>
              </li>
            )}
            {authStatus ? (
              <button onClick={logoutHandler}>Log out</button>
            ) : (
              <>
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
              </>
            )}
          </ul>
          <div className="text-3xl relative flex items-center justify-center mt-5 ml-3 h-10 sm:-mr-11">
            <Link to={"cart"}>
              <IoBagHandleSharp />
            </Link>
            <div className="bg-red-500 absolute -right-2 -bottom-1 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
              {isNaN(totalQty) ? 0 : totalQty}
            </div>
          </div>
          <div
            className="flex justify-center items-center mx-5 mt-1 text-2xl md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CiMenuBurger />
          </div>
        </div>
      </header>
      {isOpen && (
        <div
          className="bg-[#FDF8EB] w-full flex flex-col items-center  pt-5 text-lg text-[#302620]  -mb-20 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ul className="flex flex-col gap-2">
            <li className="hover:text-[#5d5048]">
              <Link to={""}>Home</Link>
            </li>
            <li className="hover:text-[#5d5048]">
              <Link>Products</Link>
            </li>
            <li className="hover:text-[#5d5048]">
              <Link to={"add-product"}>Add Product</Link>
            </li>
            {authStatus ? (
              <button onClick={logoutHandler}>Log out</button>
            ) : (
              <>
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
