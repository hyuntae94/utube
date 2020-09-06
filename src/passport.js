import passport from "passport";
import User from "./models/User";
import KakaoStrategy from "passport-kakao";
import GithubStrategy from "passport-github";
import { githubLoginCallback, kakaoLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
	new GithubStrategy({
		clientID: process.env.GH_ID,
		clientSecret: process.env.GH_SECRET,
		callbackURL: process.env.PRODUCTION
			? `https://morning-oasis-63813.herokuapp.com${routes.githubCallback}`
			: `http://localhost:3333${routes.githubCallback}`
	},
		githubLoginCallback
	)
);

passport.use(
	new KakaoStrategy({
		clientID: process.env.KO_ID,
		clientSecret: "",
		callbackURL: process.env.PRODUCTION
			? `https://morning-oasis-63813.herokuapp.com${routes.kakaoCallback}`
			: `http://localhost:3333${routes.kakaoCallback}`
	},
		kakaoLoginCallback
	)
);
