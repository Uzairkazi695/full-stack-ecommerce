const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteCartCollectionId: String(
    import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID
  ),
  appwriteCustomerCollectionId: String(
    import.meta.env.VITE_APPWRITE_CUSTOMER_COLLECTION_ID
  ),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appwriteFunctionId: String(import.meta.env.VITE_APPWRITE_FUNCTION_ID),
  appwriteFunctionProjectId: String(import.meta.env.VITE_APPWRITE_FUNCTION_PROJECT_ID),
  appwriteApiKey: String(import.meta.env.VITE_APPWRITE_API_KEY),
  stripeSecretKey: String(import.meta.env.VITE_STRIPE_SECRET_KEY),
  stripeWebhookSecret: String(import.meta.env.VITE_STRIPE_WEBHOOK_SECRET),
};

export default conf;
