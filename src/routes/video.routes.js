import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  deleteVideo,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
const router = Router();

router.route("/publish-video").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);
router.route("/update-video/:id").post(upload.single("thumbnail"), updateVideo);
router.route("/get-video/:id").get(getVideoById);
router.route("/delete-video/:id").post(deleteVideo);
router.route("/toggle-status/:id").post(togglePublishStatus);

export default router;
