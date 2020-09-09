import routes from "../routes";
import User from "../models/User";
import passport from "passport";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        req.flash("error", "Password Not Match");
        res.status(400);
        res.render("Join", { pageTitle: "Join" });
    } else {
        try {
            const user = await User({
                name,
                email
                //req.body의 name,email인가 UserSchema의 name,email인가
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
}

export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home,
    successFlash: "Welcome",
    failureFlash: "Cant log in. Check email and/or password"
});

export const githubLogin = passport.authenticate("github", {
    successFlash: "Welcome",
    failureFlash: "Cant log in ! "
});

export const githubLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, avatar_url, name, email }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl: avatar_url
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogIn = (req, res) => {
    res.redirect(routes.home);
}

// Kakao Login
export const kakaoLogin = passport.authenticate("kakao", {
    failureFlash: "Failed",
    successFlash: "Success"
})

export const kakaoLoginCallback = async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile, done)
    const {
        _json: {
            id,
            properties: {
                nickname: name,
                profile_image: avatar_url
            },
            kakao_account: {
                email
            }
        }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.kakaoId = id;
            user.save();
            return done(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            kakaoId: id,
            avatarUrl: avatar_url
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error);
    }
};

export const postKakaoLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.flash("info", "Logged out, see you later");
    req.logout();
    res.redirect(routes.home);
};

export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "User Detail", user: req.user });
}

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle: "UserDetail", user });
    } catch (error) {
        req.flash("error", "User not found");
        res.redirect(routes.home);
    }
}

export const getEditProfile = (req, res) =>
    res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    console.log(req);
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.location : req.user.avatarUrl
        });
        req.flash("success", "Profile Update");
        res.redirect(routes.me);
    } catch (error) {
        req.flash("error", "Dont update profile");
        res.render("editProfile", { pageTitle: "Edit Profile" });
    }
};

export const getChangePassword = (req, res) =>
    res.render("changePassword", { pageTitle: "ChangePassword" });

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    try {
        if (newPassword !== newPassword1) {
            req.flash("error", "Passwords don't match");
            res.status(400);
            res.redirect(`/users/${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        req.flash("error", "Can't change password");
        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
    }
};
