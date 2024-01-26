import { useState } from "react";
import { useAuth } from "../contexts/authentication";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState({});
  const { register } = useAuth();
  function handleAvatar(e) {
    e.preventDefault();

    const id = Date.now();
    if (Object.keys(avatar).length === 2) {
      return;
    }
    setAvatar({
      ...avatar,
      [id]: e.target.files[0],
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastNamee", lastName);
    for (let key in avatar) {
      formData.append("avatar", avatar[key]);
    }
    register(formData);
  };
  function handleDeleteAvatar(e, avatarKey) {
    e.preventDefault();
    const newAvatar = { ...avatar };
    delete newAvatar[avatarKey];
    setAvatar({ ...newAvatar });
  }
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
        <div className="input-container">
          <label>
            Avatar
            <input
              id="avatar"
              name="avatar"
              type="file"
              placeholder="Enter last name here"
              multiple
              onChange={handleAvatar}
            />
          </label>

          {Object.keys(avatar).map((avatarKey) => {
            const file = avatar[avatarKey];
            return (
              <div key={avatarKey}>
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <button
                  style={{ width: "100px", textAlign: "center" }}
                  onClick={(e) => handleDeleteAvatar(e, avatarKey)}
                >
                  💩
                </button>
              </div>
            );
          })}
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
