import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./apps/auth.js";
import postRouter from "./apps/posts.js";
import { client } from "./utils/db.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

async function init() {
  dotenv.config();
  // 4.4 นำข้อมูล API KEY จากเว็บ cloudinary มา setup ที่ฝั่ง server
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

  const app = express();
  const port = 4000;

  await client.connect();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/auth", authRouter);
  app.use("/posts", postRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
