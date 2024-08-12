import React, { useEffect, useState } from "react";
import service from "../appwrite/config";
import ProductCard from "../components/ProductCard";

function AllProduct() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    service.getListings([]).then((product) => {
      if (product) setProduct(product.documents);
    });
  }, []);
  return (
    <div className="w-full py-8">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {product.map((post) => (
          <div key={post.$id} className="p-2 m-5">
            <ProductCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProduct;
