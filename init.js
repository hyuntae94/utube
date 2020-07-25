import app from "./app";

const PORT = 7000;

const handleListening = () =>
    console.log(`✅ Listening on : http://localhost:${PORT}`);

app.listen(PORT, handleListening);