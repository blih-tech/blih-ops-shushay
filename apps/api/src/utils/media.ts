import fs from "fs/promises";
import path from "path";
import { deleteFromCloudinary } from "../services/cloudinary.service";

/**
 * Deletes a previously stored asset — either from Cloudinary (when publicId is present)
 * or from the local uploads directory (legacy local storage fallback).
 *
 * Non-fatal: errors are logged as warnings and do not propagate.
 */
export async function deleteOldAsset(
  fileUrl: string | null | undefined,
  publicId: string | null | undefined,
  resourceType: "image" | "video" | "raw",
): Promise<void> {
  if (publicId) {
    await deleteFromCloudinary(publicId, resourceType);
  } else if (fileUrl && fileUrl.includes("/uploads/")) {
    try {
      const urlParts = fileUrl.split("/uploads/");
      if (urlParts.length === 2) {
        const relativePath = urlParts[1];
        const localPath = path.join("uploads", relativePath);
        await fs.unlink(localPath);
      }
    } catch (err) {
      console.warn("Could not delete old local file:", err);
    }
  }
}
