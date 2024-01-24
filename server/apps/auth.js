import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { db } from "../utils/db.js";
import { cloudinaryUpload } from "../utils/upload.js";
const authRouter = Router();

// Step 2: ให้ Setup ตัว Multer (ต้องติดตั้ง Package ด้วย)
// เพื่อแกะไฟล์ออกมาจาก Request ที่ Client ส่งมาแบบ "multipart/form-data"
// โค้ดดบรรทัดล่างเป็นการระบุว่าให้เอาไฟล์มาเก็บไว้ใน Folder `public/files` บน Server ชั่วคราว
const multerUpload = multer({ dest: "public\\files" });
// สร้าง Validation rule ของ Key "avatar" ที่ส่งมาจาก Client ว่าให้ส่งไฟล์มาได้มากสุด 2 ไฟล์
const avatarUpload = multerUpload.fields([{ name: "avatar", maxCount: 2 }]);

authRouter.post("/register", avatarUpload, async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  // Step 3: สร้าง Request ไปหา Cloudinary เพื่อ Uplaod ไฟล์ไปยัง Server Cloudinary
  const avatarUrl = await cloudinaryUpload(req.files);
  // Step 4: จากนั้นนำ Url ของไฟล์ที่เก็บไว้ใน Cloudinary พร้อมข้อมูลอื่นๆ ที่ได้จาก Response จาก Function cloudinaryUpload
  // มาเก็บไว้ใน Object user ซึ่งเดี๋ยวเราจะเอาไปเก็บลงใน Database
  user["avatars"] = avatarUrl;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Step 5: เก็บข้อมูลของ Userพร้อมกับข้อมูล Metadata ของไฟล์ ลงใน Database
  const collection = db.collection("users");
  await collection.insertOne(user);

  // Step 6: Return ตัว Response กลับไปให้ Client
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
