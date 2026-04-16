import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;

// Ensure keys physically exist and are not local mock variants
const hasCloudinary = Boolean(apiKey && apiKey !== 'placeholder' && cloudName && cloudName !== 'placeholder');

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const makeStorage = (folder: string) => {
  if (hasCloudinary) {
    return new CloudinaryStorage({
      cloudinary,
      params: async (_req: Request, file: Express.Multer.File) => ({
        folder: `azlik/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      } as any),
    });
  } else {
    // Elegant fallback to local filesystem if no valid Cloudinary keys are present
    return multer.diskStorage({
      destination: (_req, _file, cb) => {
        const uploadPath = path.join(__dirname, `../../../uploads/${folder}`);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${folder}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });
  }
};

export default cloudinary;
