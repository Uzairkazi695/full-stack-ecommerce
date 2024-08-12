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
      console.log("updating a listing");

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
      console.log("deleting a listing");

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
      console.log("getting a listing");

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
      console.log("getting all listings");

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
    console.log("deleting a file");

    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error ", error);
      return false;
    }
  }

  getFilePreview(fileID) {
    console.log("getting a file preview");

    return this.bucket.getFilePreview(conf.appwriteBucketId, fileID);
  }

  adminRole(){
    return Role.team("admin")
  }
}

const service = new Service();

export default service;
