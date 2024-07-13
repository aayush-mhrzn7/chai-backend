import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    //uplaod file in cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded suceesfully
    /* console.log(
      "file has been uploaded to cloudinary sucessfully",
      response.url
    ); */
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //removes the local saved temporary file when upload is failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFilesFromCloudinary = async (cloudinaryUrl) => {
  try {
    const cloudinaryID = cloudinaryUrl.split("/").pop();
    console.log("cloudinaryID", cloudinaryID);
    const response = await cloudinary.v2.uploader.destroy(cloudinaryUrl, {
      resource_type: "auto",
    });
    if (!response) {
      throw new ApiError(400, "error when deleting the old document partt 1");
    }
  } catch (error) {
    throw new ApiError(400, "error when deleting the old document");
  }
};
export { uploadOnCloudinary, deleteFilesFromCloudinary };
