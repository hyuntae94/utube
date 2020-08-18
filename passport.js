import passport from "passport";
import User from "./models/User";
import GithubStrategy from "passport-github";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
	new GithubStrategy({
		clientID: process.env.GH_ID,
		clientSecret: process.env.GH_SECRET,
		callbackURl: `http://localhost:3333${routes.githubCallback}`
	},
		githubLoginCallback
	)
);
