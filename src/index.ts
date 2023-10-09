import { Request, Response } from "express";


const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world my friend I love you")
})

app.listen(PORT, () => {
    console.log(`Server open on ${PORT}: `);
})