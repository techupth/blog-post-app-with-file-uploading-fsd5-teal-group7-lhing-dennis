import { useState } from "react";
import { useAuth } from "../contexts/authentication";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [avatars, setAvatars] = useState({});

  const { register } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    for (let avatarKey in avatars) {
      formData.append("avatar", avatars[avatarKey]);
    }

    // Step 1: นำ Function register ที่ใช้ส่ง Request พร้อมไฟล์ไปยัง Server มา Execute ตอนที่กดปุ่ม Submit ฟอร์ม
    register(formData);
  };

  const handleFileChange = (event) => {
    const uniqueId = Date.now();
    setAvatars({
      ...avatars,
      [uniqueId]: event.target.files[0],
    });
  };

  const handleRemoveImage = (event, avatarKey) => {
    event.preventDefault();
    delete avatars[avatarKey];
    setAvatars({ ...avatars });
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
        {/* Step 0: ให้สร้างปุ่มสำหรับกด Upload ไฟล์ */}
        <div className="input-container">
          <label htmlFor="upload">
            Avatar
            <input
              id="upload"
              name="avatar"
              type="file"
              placeholder="Enter last name here"
              onChange={handleFileChange}
              hidden
            />
          </label>
          <div className="image-list-preview-container">
            {/* Step 0: เอารูปภาพที่ผู้ใช้งานเลือกมาแสดงผล */}
            {Object.keys(avatars).map((avatarKey) => {
              const file = avatars[avatarKey];
              return (
                <div key={avatarKey} className="image-preview-container">
                  <img
                    className="image-preview"
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                  />
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
