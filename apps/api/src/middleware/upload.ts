import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "./errorHandler";

// Ensure temporary upload directories exist
const tmpDir = "uploads/tmp";
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Storage configurations
const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Image filter
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only JPEG, PNG, and WebP images are allowed") as any, false);
  }
};

// PDF filter
const pdfFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only PDF files are allowed") as any, false);
  }
};

// Video filter — mp4, webm, quicktime
const videoFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only MP4, WebM, and MOV video files are allowed") as any, false);
  }
};

// Document filter — pdf, docx, pptx
const documentFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.ms-powerpoint",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only PDF, DOCX, and PPTX document files are allowed") as any, false);
  }
};

// Exported Multer Upload Instances
export const photoUpload = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
}).single("photo");

export const cvUpload = multer({
  storage: memoryStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
}).single("cv");

export const logoUpload = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
}).single("logo");

export const videoUpload = multer({
  storage: diskStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB
  }
}).single("video");

export const documentUpload = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
}).single("document");
