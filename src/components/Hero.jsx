import React from "react";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <>
      <section className="bg-primary-foreground flex  justify-around h-[700px]">
        <div className="flex flex-col justify-center items-center ml-9 max-w-lg gap-5">
          <h2 className=" flex  text-5xl text-[#3c2b20] text-medium uppercase">
            Discover Your Perfect Style
          </h2>
          <p className="flex justify-center items-center text-2xl  text-[#3c2b20]">
            Explore our wide range of products, designed to elevate your
            everyday look. Shop now and find your new favorite pieces.
          </p>
          <div className=" w-full">
            <Link>
              <Button>SHOP NOW</Button>
            </Link>
          </div>
        </div>
        <div>
          <img src={hero} alt="" className="hidden md:block h-[700px]" />
        </div>
      </section>
    </>
  );
}
