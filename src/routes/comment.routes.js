import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/commet.controller.js";

const router = Router();

router.route("/get-comments").get(verifyJWT, getVideoComments);
router.route("/add-comment").post(verifyJWT, addComment);
router.route("/update-comment/:commentId").post(verifyJWT, updateComment);
router.route("/delete-comment/:commentId").get(verifyJWT, deleteComment);

export default router;
