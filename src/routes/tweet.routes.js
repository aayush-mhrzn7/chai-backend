import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  createTweet,
  deleteTweets,
  getAllTweets,
  updateTweets,
} from "../controllers/tweet.controller";
const router = Router();
router.route("/get-all-tweets").get(verifyJWT, getAllTweets);
router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/update-tweet/:tweetID").post(verifyJWT, updateTweets);
router.route("/delete-tweet/:tweetID").get(verifyJWT, deleteTweets);
export default router;
