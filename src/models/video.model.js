import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    videoFile: {
      type: String, //cloudinary
      required: true,
      index: true, //for searching user index for searching field
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String, //we will get url from cloudinary so that we can save images in url form so that they take less storage
      required: true,
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
//aggregation middleware
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
