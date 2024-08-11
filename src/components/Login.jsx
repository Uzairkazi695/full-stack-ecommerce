import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    setError("");
    try {
      console.log("Login data:", data);
      const session = await authService.login(data);
      console.log("Session response:", session);

      if (session) {
        const userData = await authService.getCurrentUser();
        console.log("User data:", userData);
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/");
        } else {
          setError("Failed to fetch user data.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred");
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (cookieFallback === '[]' || cookieFallback === null) {
       navigate('/login/');
    }
    }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to Login
          </CardDescription>
          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        </CardHeader>
        <form onSubmit={handleSubmit(login)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-red-600">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
