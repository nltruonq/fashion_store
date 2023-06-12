import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../redux/toolkits/userSlice";

import { toast } from "react-toastify";
import "./resetPassword.scss";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loader/Loader";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const {loading} = useSelector(state => state.userState)

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(resetPassword({ token, password, confirmPassword })).unwrap();
      history("/");
      toast.success("Đổi mật khẩu thành công");
    } catch (err) {
      toast.error("Đổi mật khẩu không thành công");
    }
  };

  return (
    <div className="resetpassword-screen">
      <form onSubmit={handleSubmit} className="resetpassword-screen__form">
        <h3 className="resetpassword-screen__title">Thay đổi mật khẩu</h3>
        <div className="form-group">
          <div className="form-group__align">
            <label htmlFor="password">Mật khẩu mới:</label>
          </div>
          <input
            type="password"
            required
            id="password"
            placeholder="Nhập mật khẩu mới..."
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="form-group__align">
            <label htmlFor="confirmpassword">Xác nhận mật khẩu:</label>
          </div>
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Nhập lại mật khẩu..."
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-submit">
          <button onClick={handleSubmit} type="submit" className="btn">
            Cập nhật
          </button>
        </div>
      </form>
      {
        loading && <Loader />
      }
    </div>
  );
};

export default ResetPassword;
