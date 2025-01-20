import { v2 as cloudinary } from "cloudinary";
import config from "../../config/cloudinary";
config();

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: any;
  }
  
class CloudinaryRepo {
  /**
   * Uploads an image to Cloudinary.
   * @param {string} filePath - Path to the image file.
   * @param {string} folder - Path to the image file.
   * @param {object} options - Optional configuration for the upload.
   * @returns {Promise<CloudinaryUploadResult>} - The Cloudinary response.
   */
  static async uploadImage(
    filePath: string,
    folder: string,
    options: Record<string, unknown> = {}
  ): Promise<CloudinaryUploadResult > {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        ...options,
      });
      console.log(result);
      return result as CloudinaryUploadResult ;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Image upload failed");
    }
  }

  /**
   * Deletes an image from Cloudinary.
   * @param {string} publicId - The public ID of the image to delete.
   * @returns {Promise<object>} - The Cloudinary response.
   */
  static async deleteImage(publicId: string): Promise<object> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw new Error("Image deletion failed");
    }
  }

  /**
   * Retrieves details of an uploaded image from Cloudinary.
   * @param {string} publicId - The public ID of the image.
   * @returns {Promise<object>} - The Cloudinary resource details.
   */
  static async getImageDetails(publicId: string): Promise<object> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error("Error retrieving image details from Cloudinary:", error);
      throw new Error("Failed to retrieve image details");
    }
  }
}

export default CloudinaryRepo;