import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./register.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../header/Header";

import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../redux/toolkits/userSlice";
import Loader from "../../loader/Loader";

const Register = () => {
  const dispatch = useDispatch();

  const {loading} = useSelector(state => state.userState)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useNavigate();

  const [avatar, setAvatar] = useState(
    "data:image/png;base64,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"
  );
  const [avatarPreview, setAvatarPreview] = useState(
    "data:image/png;base64,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"
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register({ name, email, password, avatar })).unwrap();
      history("/account/login");
      toast.success("Đăng ký thành công!");
    } catch (err) {
      toast.error("Đăng ký thất bại!");
    }
  };

  const handleAvatarChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <div className="register-screen">
        <form onSubmit={handleSubmit} className="register-screen__form">
          <h3 className="register-screen__title">Đăng ký 💙</h3>
          <div className="form-group">
            <div className="form-group__align">
              <label htmlFor="name">Tên:</label>
            </div>
            <input
              type="text"
              required
              id="name"
              placeholder="Nhập tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-group__align">
              <label htmlFor="email">Email:</label>
            </div>
            <input
              type="email"
              required
              id="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-group__align">
              <label htmlFor="password">Mật khẩu:</label>
            </div>
            <input
              type="password"
              required
              id="password"
              autoComplete="true"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group avt-file">
            <img src={avatarPreview} alt="Avatar Preview" />
            <label className="file">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <span className="file-custom"></span>
            </label>
          </div>
          <div className="form-submit">
            <button onClick={handleSubmit} type="submit" className="btn">
              Đăng ký
            </button>
          </div>

          <span className="register-screen__subtext">
            Bạn đã có tài khoản trước đó? <Link to="/account/login">Đăng nhập</Link>
          </span>
        </form>
        {
          loading && <Loader />
        }
      </div>
    </>
  );
};

export default Register;
