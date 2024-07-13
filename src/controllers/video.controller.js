import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFilesFromCloudinary,
  uploadOnCloudinary,
} from "../utils/Cloudinary.js";
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  if (
    [title, description, isPublished].some((fields) => fields?.trim() === "")
  ) {
    throw new ApiError(400, "all fields must be resent");
  }
  /* const existingVideo = await Video.findOne({ title });
  if (!existingVideo) {
    throw new ApiError(400, "there is a video existing  ");
  } */
  const videoFilePath = req.files?.videoFile[0]?.path;
  const thumbnailFilePath = req.files?.thumbnail[0]?.path;

  if (!videoFilePath && !thumbnailFilePath) {
    throw new ApiError(
      400,
      "there is an error in uploading filepath of multer "
    );
  }
  const video = await uploadOnCloudinary(videoFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailFilePath);
  if (!video) {
    throw new ApiError(
      400,
      "there is an error when uploading video to the cloud"
    );
  }
  if (!thumbnail) {
    throw new ApiError(
      400,
      "there is an error when uploading video to the cloud"
    );
  }
  const uploadVideo = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: video.url,
    isPublished,
  });
  if (!uploadVideo) {
    throw new ApiError(400, "error in creating a new video");
  }
  const checkVideoCreated = await Video.findById(uploadVideo?._id);
  if (!checkVideoCreated) {
    throw new ApiError(400, "error in creating a new video 2");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, checkVideoCreated, "the new video has been uploaded")
    );
});
const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);
  if (!id?.trim()) {
    throw new ApiError(400, "invalid id ");
  }
  const { title, description, isPublished } = req.body;
  if (!title && !description) {
    throw new ApiError(400, "error all fields are required");
  }

  const thumbnailPath = req.file?.path;
  console.log(req.file.path);

  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail are required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  if (!thumbnail) {
    throw new ApiError(400, "thumbnail upload cloudinary error");
  }
  const video = await Video.findByIdAndUpdate(
    id,
    {
      $set: {
        description: description,
        title: title,
        thumbnail: thumbnail.url,
        isPublished,
      },
    },
    { new: true }
  );
  console.log("video:", video);
  if (!video) {
    throw new ApiError(400, "video upload failed on database");
  }
  res
    .status(200)
    .json(new ApiResponse(200, video, "video has been sucessfully uploaded"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "the id provided doesnt exist");
  }
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(400, "the videp doesnt exist");
  }
  console.log(video.videoFile);
  return res
    .status(200)
    .json(200, video.videoFile, "sucessfully retrived video");
});
const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "there is no id ");
  }
  const video = await Video.findById(id);
  const videoUrl = video.videoFile;
  if (videoUrl) {
    const publicId = videoFileUrl.split("/").pop().split(".")[0];
    try {
      await deleteFilesFromCloudinary(publicId);
    } catch (error) {
      throw new ApiError(400, "error delete clout");
    }
  }
  const deletevidep = await Video.findByIdAndDelete(id);
  console.log(deletevidep);
  return res.status(200).json(new ApiResponse(200, "Deleted suceessfully"));
});
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "there is no id ");
  }
  console.log("before", video.isPublished);
  const video = await Video.findByIdAndUpdate(
    id,
    {
      $set: {
        isPublished: !isPublished,
      },
    },
    { new: true }
  );
  console.log("after:", video.isPublished);
  return res
    .status(200)
    .json(new ApiResponse(200, "changed status suceessfully"));
});

export {
  publishVideo,
  updateVideo,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
};
