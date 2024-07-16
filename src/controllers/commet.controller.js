import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {});
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!id) {
    throw new ApiError(400, "there is no video of that id");
  }
  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(400, "there is no video of the provided url");
  }
  if (!content) {
    throw new ApiError(400, "there is no comment");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, "only users can comment on a post");
  }
  const comment = await Comment.create({
    content,
    owner: req.user._id,
    video: id,
  });
  if (!comment) {
    throw new ApiError(400, "error in adding comment in database");
  }
  return res
    .send(200)
    .json(new ApiResponse(200, comment, "suceesfully added a commment"));
});
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "there is no video from this id");
  }
  const { content } = req.body;
  if (!content) {
    throw new ApiError(
      400,
      "there is no content from this user that needs to be changed"
    );
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, "there is no user ");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!comment) {
    throw new ApiError(400, "there is no comment ");
  }
  res
    .status(200)
    .json(new ApiResponse(200, comment, "sucessfully updated the comment"));
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "there is no commentId");
  }
  const comment = Comment.findById(commentId);
  if (!comment) {
    {
      throw new ApiError(400, "there is no comment");
    }
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "there is no from user");
  }
  await Comment.findByIdAndDelete(commentId);
  res.status(200).json(200, {}, "deleted sucessfully");
});
export { addComment, getVideoComments, updateComment, deleteComment };
