import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const makeStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
      folder: `azlik/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    }),
  });

export default cloudinary;
