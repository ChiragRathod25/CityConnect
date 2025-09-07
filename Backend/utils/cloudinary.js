import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import 'dotenv/config'
import { extractPublicId } from 'cloudinary-build-url';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (uploadFilePath) => {
  try {
    
    if (!uploadFilePath) return null;
    const responce = await cloudinary.uploader
      .upload(uploadFilePath, {
        resource_type: "auto",
      })     
      .catch((error) =>
        console.error("Error while uploading !!\nError: ", error)
      );
    fs.unlinkSync(uploadFilePath);
    return responce;
  } catch (error) {
    console.error(
      "Error while uploading file to cloudinary !!\nError: ",
      error
    );
    fs.unlinkSync(uploadFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (deleteFileURL) => {
    try {
      if (!deleteFileURL) return null;
      const publicId = extractPublicId(
        deleteFileURL
      );
      
      const reourseType=deleteFileURL.includes("image")?"image":"video"
      const responce = await cloudinary.uploader
        .destroy(publicId,
          {
            invalidate: true,
            resource_type: reourseType,
          }
        )
        .catch((error) =>
          console.error("Error while deleting !!\nError: ", error)
        );
        if(responce.result !== "ok"){
          console.error("Error while deleting file from cloudinary !!\nError: ", responce)
          return null
        }
      return responce;
      
    } catch (error) {
      console.error(
        "Error while deleting file from cloudinary !!\nError: ",
        error
      );
      return null;
    }
};
export { uploadOnCloudinary,deleteFromCloudinary };