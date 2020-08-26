import passport from "passport";
import User from "./models/User";
import FacebookStrategy from "passport-facebook";
import GithubStrategy from "passport-github";
import { githubLoginCallback, facebookLoginCallback } from "./controllers/userController";
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

passport.use(
	new FacebookStrategy({
		clientID: process.env.FB_ID,
		clientSecret: process.env.FB_SECRET,
		callbackURl: `http://localhost:3333${routes.facebookCallback}`
	},
		facebookLoginCallback
	)
)
