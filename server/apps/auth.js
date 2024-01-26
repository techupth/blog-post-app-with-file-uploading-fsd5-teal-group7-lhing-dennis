import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import multer from "multer";
import { cloudinaryUpload } from "../utils/upload.js";

const authRouter = Router();

// 3.1 npm i multer แล้ว import ให้เรียบร้อย แล้ว setup ตัว multer เพื่อแกะไฟล์ออกมาจาก request ที่ client ส่งมาแบบ multipart/form-data
// 3.2 execute ตัว multer และระบุว่า ให้เอาไฟล์มาเก็บไว้ใน folder ไหน บน server ชั่วคราว
// ไฟล์ที่รับจาก client จะถูกเก็บใน folder บน sever ชั่วคราวก่อนจะส่งไปเก็บที่ cloudinary
const multerUpload = multer({ dest: "uploads/" });
// สร้าง validation rule (เป็น middleware) ของ key "avatar" ว่า ให้ส่งไฟล์มาได้มากสุด 2 ไฟล์
// "avatar" คือ key ที่อยู่ใน form-data ต้องระบุให้ตรงกับ client
const avatarUpload = multerUpload.fields([{ name: "avatar", maxCount: 2 }]);

// 3.3 นำ middleware avatarUpload มา execute ใน APIs ของ register
authRouter.post("/register", avatarUpload, async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  // 3.4 สร้าง request ไปหา cloudinary เพื่อ upload ไฟล์ไปยัง server cloudinary
  const avatarUrl = await cloudinaryUpload(req.files); // req.files คือไฟล์ที่ถูกแกะเรียบร้อยแล้ว
  //4.2 นำ url ของไฟล์ที่เก็บไว้ใน cloudinary พร้อมข้อมูลอื่น ๆ ที่ได้จาก response จาก function cloudinaryUpload
  // มาเก็บไว้ใน object user ซึ่งจะเอาไปเก็บใน database
  user["avatars"] = avatarUrl;

  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("users");
  await collection.insertOne(user); // นำข้อมูลมา insert
  // 5. Return response to client  (finish)
  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const user = await db.collection("users").findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(400).json({
      message: "password not valid",
    });
  }

  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECRET_KEY,
    {
      expiresIn: 900000,
    }
  );

  return res.json({
    message: "login succesfully",
    token,
  });
});

export default authRouter;
