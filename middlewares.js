import routes from "./routes"

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "uTube";
    res.locals.routes = routes;
    next();
};