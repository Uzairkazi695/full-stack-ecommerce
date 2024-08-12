import React from "react";

function Cart() {
  const submit = async (data) => {
    try {
      if (product) {
        const file = data.image[0]
          ? await service.uploadFile(data.image[0])
          : null;
        console.log("uploading file", file);
        if (file) {
          return await service.deleteFile(product.image);
        }

        const dbPost = await service.updateListing(product.$id, {
          ...data,
          image: file ? file.$id : undefined,
        });
        if (dbPost) {
          navigate(`/product/${dbPost.$id}`);
        } else {
          console.error("Post update failed", dbPost);
        }
      } else {
        const file = await service.uploadFile(data.image[0]);

        if (file) {
          const fileID = file.$id;
          data.image = fileID;

          const dbPost = await service.createListing({
            ...data,
            userId: fileID,
            productId: fileID,
          });
          console.log("createListing", dbPost);

          if (dbPost) {
            navigate(`./product/${dbPost.$id}`);
          } else {
            console.error("Post creation failed", dbPost);
          }
        }
      }
    } catch (error) {
      console.error("Error during submit:", error);
    }
  };

  return <div>Cart</div>;
}

export default Cart;
