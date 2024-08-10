import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import service from "../../appwrite/config";

export default function ProductForm({ product }) {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        title: product?.title || "",
        slug: product?.slug || "",
        description: product?.description || "",
        price: product?.price || "",
        status: product?.status || "active",
        qty: 1,
        category: product?.category || "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

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
          console.log("database", dbPost);
          

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

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        <Label htmlFor="title">
          Product Title<span className="text-red-600">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        <Label htmlFor="slug">
          Slug <span className="text-red-600">*</span>
        </Label>
        <Input
          id="slug"
          type="text"
          placeholder="slug"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <Label htmlFor="description">
          Description <span className="text-red-600">*</span>
        </Label>
        <Textarea label="description" name="description" control={control} />
        <Label htmlFor="category">
          Product Category<span className="text-red-600">*</span>
        </Label>
        <Input
          id="category"
          type="text"
          placeholder="Category"
          {...register("category", { required: true })}
        />
        <Label htmlFor="price">
          Price<span className="text-red-600">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="Price"
          {...register("price", { required: true })}
        />
        <Label htmlFor="image">
          Product Image<span className="text-red-600">*</span>
        </Label>
        <Input
          id="image"
          type="file"
          placeholder="image"
          {...register("image", { required: true })}
        />
        {product && (
          <div className="w-full mb-4">
            <img
              src={service.getFilePreview(post.image)}
              alt={product.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">active</SelectItem>
            <SelectItem value="inactive">inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          {product ? "update product" : "Add product"}
        </Button>
      </div>
    </form>
  );
}
