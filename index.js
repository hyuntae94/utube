import express from "express";
const app = express();

const PORT = 7000;

const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`);

const handleHome = (req, res) => res.send("Main Page");

const handleProfile = (req, res) => res.send("profile page");

const betweenHome = (req, res, next) => {
    console.log("Between");
    next();
};
app.use(betweenHome);

app.get('/', handleHome);

app.get("/profile", handleProfile);

app.listen(PORT, handleListening);