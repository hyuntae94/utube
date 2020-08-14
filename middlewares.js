import multer from "multer"
import routes from "./routes"

const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "uTube";
    res.locals.routes = routes;
    res.locals.user = req.user || null;
    console.log(req.user);
    //app.use(passport.initialize())에 의해 req.user 생성
    next();
};

export const uploadVideo = multerVideo.single("videoFile");
