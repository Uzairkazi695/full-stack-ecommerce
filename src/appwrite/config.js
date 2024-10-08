import conf from "../conf/conf";
import {
  Client,
  ID,
  Storage,
  Query,
  Databases,
  Permission,
  Role,
} from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createListing({
    title,
    slug,
    description,
    image,
    status,
    userId,
    price,
    qty,
    category,
    productId,
  }) {
    try {
      console.log("creating a listing");

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          description,
          image,
          status,
          userId,
          price,
          qty,
          category,
          productId,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createListing :: error ", error);
      throw error;
    }
  }

  async updateListing(
    slug,
    { title, description, image, status, price, qty, category }
  ) {
    try {
      const result = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          description,
          image,
          status,
          price,
          qty,
          category,
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log("Appwrite service :: updateListing :: error ", error);
      throw error;
    }
  }

  async deleteListing(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteListing :: error ", error);
      return false;
    }
  }

  async getListing(slug) {
    try {
      const result = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return result;
    } catch (error) {
      console.log("Appwrite service :: getListing :: error ", error);
      return false;
    }
  }

  async getListings(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite service :: getListings :: error ", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      console.log("uploading a file");

      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      const result = await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId
      );

      return result;
    } catch (error) {
      console.error(
        "Appwrite service :: deleteFile :: error ",
        error.message,
        error.response
      );
      return false;
    }
  }

  getFilePreview(fileID) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileID);
  }

  adminRole() {
    return Role.team("admin");
  }

  async addCartItem(userId, productId, quantity, price) {
    try {
      const cartItemId = ID.unique();

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        cartItemId,
        {
          userId,
          productId,
          quantity,
          price,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: addCartItem :: error ", error);
      throw error;
    }
  }
  async updateCartItem(userId, productId, quantity) {
    try {
      console.log("updating cart item");

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        // [Query.equal("userId", userId)],
        productId,
        {
          quantity,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateCartItem :: error ", error);
      throw error;
    }
  }

  async deleteCartItem(cartItemId) {
    try {
      const result = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        cartItemId
      );

      return result;
    } catch (error) {
      console.log("Appwrite service :: deleteCartItem :: error ", error);
      return false;
    }
  }

  async getCartItems(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      console.log("Appwrite service :: getCartItems :: error ", error);
      return false;
    }
  }
}

const service = new Service();

export default service;
