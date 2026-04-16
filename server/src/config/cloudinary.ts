import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const makeStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (_req: Request, file: Express.Multer.File) => ({
      folder: `azlik/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    } as any),
  });

export default cloudinary;
