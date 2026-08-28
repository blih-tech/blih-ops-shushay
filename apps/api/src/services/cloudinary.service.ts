import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads a readable stream to Cloudinary (perfect for files on disk or custom streams)
 */
export function uploadStream(
  stream: Readable,
  options: { folder: string; resource_type: "image" | "video" | "raw"; public_id?: string }
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload returned empty result"));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    stream.pipe(upload);
  });
}

/**
 * Uploads a memory buffer to Cloudinary by converting it to a readable stream
 */
export function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; resource_type: "image" | "video" | "raw"; public_id?: string }
): Promise<CloudinaryUploadResult> {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return uploadStream(readable, options);
}

/**
 * Deletes an asset from Cloudinary by its public ID and resource type
 */
export async function deleteFromCloudinary(
  publicId: string | null | undefined,
  resourceType: "image" | "video" | "raw"
): Promise<void> {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    if (result.result !== "ok" && result.result !== "not found") {
      console.warn(`Cloudinary destroy returned non-ok status:`, result);
    }
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error);
  }
}

/**
 * Logical folders and resource types mappings
 */
export const CloudinaryFolders = {
  talentPhoto: { folder: "blih/talents/photos", resource_type: "image" as const },
  talentCv: { folder: "blih/talents/cvs", resource_type: "raw" as const }, // Upload PDFs as raw documents
  companyLogo: { folder: "blih/companies/logos", resource_type: "image" as const },
  companyDocument: { folder: "blih/companies/documents", resource_type: "raw" as const },
  courseVideo: { folder: "blih/courses/videos", resource_type: "video" as const },
  courseDocument: { folder: "blih/courses/documents", resource_type: "raw" as const },
  courseThumbnail: { folder: "blih/courses/thumbnails", resource_type: "image" as const },
};
