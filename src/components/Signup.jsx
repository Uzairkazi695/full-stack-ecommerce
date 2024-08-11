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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const userData = await authService.createAccount(data);

      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
        console.log(userData);
        
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        </CardHeader>
        <form onSubmit={handleSubmit(create)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Your Name <span className="text-red-600">*</span>
              </Label>
              <Input id="name" type="text" placeholder="John Doe" {...register("name", {required: true})}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register("email", {required: true})}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-red-600">*</span>
              </Label>
              <Input id="password" type="password" {...register("password", {required: true})}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Create account</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
