import conf from "../conf/conf";
import { Client, ID, Storage, Query, Databases } from "appwrite";

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
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
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
      return await this.databases.updateDocument(
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
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
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
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error ", error);
      return false;
    }
  }

  getFilePreview(fileID) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileID);
  }
}

const service = new Service();

export default service;
