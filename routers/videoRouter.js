import express from "express";
import routes from "../routes";
import { videoDetail, editVideo, deleteVideo, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get(routes.videoDetail, videoDetail);
videoRouter.get(routes.editVideo, editVideo);
videoRouter.get(routes.deleteVideo, deleteVideo);
videoRouter.get(routes.upload, upload);

export default videoRouter;