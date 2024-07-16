import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweets.model.js";
import { isValidObjectId } from "mongoose";
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "the content is required");
  }
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "the user is required");
  }
  const tweet = await Tweet.create({
    content: content,
    owner: userId,
  });
  res.status(200).json(new ApiResponse(200, tweet, "tweet is created"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "the user is required");
  }
  const tweets = await Tweet.find({ owner: userId });
  if (!tweets) {
    throw new ApiError(400, "there is no user tweets");
  }
  res.status(200).json(new ApiResponse(200, tweets, "tweets is displayed"));
});

const updateTweets = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetID } = req.params;
  if (!tweetID) {
    throw new ApiError(400, "there is no tweets of this id");
  }
  if (!content) {
    throw new ApiError(400, "there is no content of this tweet");
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetID,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!updatedTweet) {
    throw new ApiError(400, "couldnt update the tweet");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedTweet, "twet has been updated sucessfully")
    );
});

const deleteTweets = asyncHandler(async (req, res) => {
  const { tweetID } = req.params;
  if (!tweetID) {
    throw new ApiError(400, "there is no tweets of this id");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetID);
  if (!deletedTweet) {
    throw new ApiError(400, "couldnt delete the tweet");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "twet has been deleted sucessfully"));
});

export { createTweet, getAllTweets, updateTweets, deleteTweets };
