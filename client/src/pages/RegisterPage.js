import { useState } from "react";
import { useAuth } from "../contexts/authentication";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  // 1.1 สร้าง state สำหรับใช้รับการ upload file ข้อมูลด้านในเป็น object
  const [avatars, setAvatars] = useState({});

  const { register } = useAuth();

  // 1.3 สร้าง handler function เก็บไฟล์เข้า state
  // ไฟล์ที่ได้มาจะเป็น key value pair {uniqueId: {file}}
  const handleFileChange = (event) => {
    const uniqueId = Date.now(); // gen มาจากระยะเวลาที่ผู้ใช้เลือกไฟล์นั้น ๆ
    // update state <key เป็น uniqueId (ใส่ [] ไว้ เพราะเป็น variable) , value เป็น file object>
    setAvatars({ ...avatars, [uniqueId]: event.target.files[0] });
  };
  // 1.6 สร้าง handler function สำหรับลบรูปภาพ
  const handleRemoveImage = (event, avatarKey) => {
    event.preventDefault();
    delete avatars[avatarKey];
    setAvatars({ ...avatars });
  };
  // handler function สำหรับ กด submit ข้อมูล
  const handleSubmit = (event) => {
    event.preventDefault();
    // 2.1 สร้าง request body ที่จะส่งข้อมูลไปที่ server
    // ข้อมูลที่จะส่งไป จะส่งแบบ multipart / form-data เพราะมีข้อมูลที่เป็น file อยู่
    // สร้าง object formData ขึ้นมา จาก class FormData
    const formData = new FormData();
    // execute function append
    formData.append("username", username);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    // loop ตัว file object แล้ว append ใส่ key "avatar"
    for (let avatarKey in avatars) {
      formData.append("avatar", avatars[avatarKey]);
    }
    // นำ function register(มาจาก useAuth) ที่ใช้ส่ง request พร้อมไฟล์ไปยัง server มา execute ตอนกดปุ่ม submit
    register(formData);
  };

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register Form</h1>
        <div className="input-container">
          <label>
            Username
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username here"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              value={username}
            />
          </label>
        </div>
        <div className="input-container">
          <label>
            Password
            <input
              id="password"
              name="password"
              type="text"
              placeholder="Enter password here"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={password}
            />
          </label>
        </div>
        <div className="input-container">
          <label>
            First Name
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Enter first name here"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
              value={firstName}
            />
          </label>
        </div>
        <div className="input-container">
          <label>
            Last Name
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Enter last name here"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              value={lastName}
            />
          </label>
        </div>
        {/* 1.2 สร้าง input หน้า client สำหรับเลือกรูปภาพ (upload file) */}
        <div className="input-container">
          <label htmlFor="avatar">
            Avatar
            <input
              id="avatar"
              name="avatar"
              type="file"
              placeholder="Enter last name here"
              multiple // ทำให้เลือกไฟล์ได้หลาย ๆ อัน
              hidden // ใส่ไว้เพราะจะเป็นปุ่มให้ choose file ไม่สามารถ style ได้
              onChange={handleFileChange} // 1.4 execute handleFileChange
            />
          </label>
          <div className="image-list-preview-container">
            {/* 1.5 นำรูปถาพที่ผู้ใช้งานเลือกมาแสดงผล */}
            {/* Object.keys(avatars) เป็นการแปลง key เป็น value ใน array แล้วนำมา map แสดงผล 
            จาก {uniqueId: {file}} เป็น [uniqueId]*/}
            {Object.keys(avatars).map((avatarKey) => {
              const file = avatars[avatarKey]; // value แต่ละอันที่อยู่ใน array
              return (
                <div key={avatarKey} className="image-preview-container">
                  <img
                    className="image-preview"
                    src={URL.createObjectURL(file)} // function ที่แปลง object file(ที่เก็บลงมาใน state) ออกมาเป็นรูปภาพเพื่อแสดงผลได้
                    alt={file.name}
                  />
                  {/* 1.7 สร้างปุ่มสำหรับกดลบรูปภาพ จากนั้น execute handleRemoveImage ที่ปุ่มนี้ */}
                  <button
                    className="image-remove-button"
                    onClick={(event) => handleRemoveImage(event, avatarKey)}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
