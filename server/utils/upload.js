import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
// 4.1 สร้าง function สำหรับ upload ไฟล์
// npm i cloudinary และ import ให้เรียบร้อย
const cloudinaryUpload = async (files) => {
  const fileUrl = [];

  for (let file of files.avatar) {
    // function สำหรับ upload ไฟล์ไปที่ cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "techupth/demo-file-uploading",
      type: "private",
    });
    // cloudinary return response กลับมา แล้ว push ไปที่ fileUrl แล้ว return fileUrl
    fileUrl.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
    await fs.unlink(file.path); // ลบไฟล์ที่เก็บในโฟลเดอร์ชั่วคราวออกด้วยหลัง upload เสร็จ
  }

  return fileUrl;
};

export { cloudinaryUpload };
