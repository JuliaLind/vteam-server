import app from "./app.js";

const port = 1337;

app.listen(port, () => {
    console.info(`Server running on port ${port}`);
});
