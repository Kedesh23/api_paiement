"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Hello world my friend I love you");
});
app.listen(PORT, () => {
    console.log(`Server open on ${PORT}: `);
});
