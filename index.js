const express = require("express");
const app = express();

const PORT = 7000;

function handleListening() {
    console.log(`Listening on: http://localhost:${PORT}`);
}

function handleHome(req, res) {
    res.send("Main Page");
}

function handleProfile(req, res) {
    res.send("profile page");
}

app.get('/', handleHome);

app.get("/profile", handleProfile);

app.listen(PORT, handleListening);