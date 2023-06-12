import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./meUpdate.scss";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../../../redux/toolkits/userSlice";
const MeUpdate = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const toggleSexRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const history = useNavigate();

  const [avatar, setAvatar] = useState(
    "data:image/png;base64,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"
  );

  // state for send data update profile
  const [avatarPreview, setAvatarPreview] = useState("/logo192.png");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState(0);
  const [phone, setPhone] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const { loading } = useSelector((state) => state.userState);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await dispatch(getUser()).unwrap();
        setAvatar(users.user.avatar.url);
        setAvatarPreview(users.user.avatar.url);
        setEmail(users.user.email ?? '')
        setName(users.user.name ?? '')
        setSex(users.user.sex ?? 0)
        setPhone(users.user.phone ?? '')
        setIsLoading(true);
      } catch (err) {}
    };
    getUsers();
  }, [refreshKey]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name !== "" && name.trim() !== "" &&
      email !== "" && email.trim() !== "" && 
      phone !== "" && phone.trim() !== "" &&
      sex !== 0 &&
      validateEmail(email) !== null
    ) {
      try {
        await dispatch(
          updateUser({ name: name.trim(), email, avatar, phone: phone.trim(), sex })
        ).unwrap();
        toast.success("Chỉnh sửa thông tin thành công");
        setRefreshKey((oldv) => oldv + 1);
        history("/me/profile");
      } catch (err) {
        toast.error("Chỉnh sửa thông tin không thành công");
      }
    } else {
      toast.error("Vui lòng nhập đúng, đầy đủ thông tin");
    }
  };

  const handleToggleSex = (e) => {
    toggleSexRef.current.classList.toggle("show");
  };

  const handleChangeValueSex = (e) => {
    toggleSexRef.current.classList.toggle("show");
    setSex(e.target.value);
  };

  return (
    <div className="col l-10 m-12 c-12 index__profile index__update">
      <>
        <div className="index__profile--heading">
          <h1 className="index__profile--heading--item">Chỉnh sửa thông tin</h1>
        </div>
        <div className="wrap__info">
          <div className="row sm-gutter flex-wrap">
            <div className="col l-8 set__height">
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
            </div>
            <div className="col l-4 set__height">
              <div className="index__profile--content--item">
                <h3
                  onClick={handleToggleSex}
                  className="index__profile--content-heading sex"
                >
                  {sex === 1 ? "Nam" : sex === 2 ? "Nữ" : "Chọn giới tính"}
                  <i className="fa-solid fa-arrows-up-down"></i>
                </h3>
                <ul
                  ref={toggleSexRef}
                  className="index__profile--content--list"
                >
                  <li
                    className="index__profile--content--list-item"
                    value="1"
                    onClick={handleChangeValueSex}
                  >
                    Nam
                  </li>
                  <li
                    className="index__profile--content--list-item"
                    value="2"
                    onClick={handleChangeValueSex}
                  >
                    Nữ
                  </li>
                </ul>
              </div>
            </div>
            <div className="col l-6 set__height">
              <div className="index__profile--content--item">
                <h3 className="index__profile--content-heading">Họ tên</h3>
                <input
                  type="text"
                  placeholder="Nhập tên..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="col l-6 set__height">
              <div className="index__profile--content--item">
                <h3 className="index__profile--content-heading">
                  Số điện thoại
                </h3>
                <input
                  type="number"
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="col l-6 set__height">
              <div className="index__profile--content--item">
                <h3 className="index__profile--content-heading">Email</h3>
                <input
                  type="email"
                  placeholder="Nhập email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="contain__button">
            <button className="btn primary-btn" onClick={handleSubmit}>
              SỬA THÔNG TIN
            </button>
          </div>
        </div>
        {loading && <Loader />}
      </>
    </div>
  );
};

export default MeUpdate;
