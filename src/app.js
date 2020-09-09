import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import path from "path";
import flash from "express-flash";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

import "./passport";//middleware처럼사용하기위해서

const app = express();

const CokieStore = MongoStore(session);
//
app.use(helmet());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: false,
		store: new CokieStore({ mongooseConnection: mongoose.connection })
	})
)
app.use(flash());
app.use(passport.initialize());//다른 middleware 사용하기전에 초기화
app.use(passport.session());
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
