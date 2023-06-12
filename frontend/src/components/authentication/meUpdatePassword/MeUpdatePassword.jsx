import React, { useState } from "react";
import axios from "axios";
import "./meUpdatePassword.scss";

import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../../redux/toolkits/userSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loader/Loader";

const MeUpdatePassword = () => {
  const dispatch = useDispatch();

  const {loading} = useSelector(state => state.userState)

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updatePassword({ oldPassword, newPassword, confirmPassword })
      ).unwrap();
      toast.success("Đổi mật khẩu thành công");
    } catch (err) {
      toast.error("Đổi mật khẩu không thành công");
    }
  };
  return (
    <div className="update-password">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Password</label>
          <input
            className="update-pass-info"
            required={true}
            type="text"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">New Password</label>
          <input
            className="update-pass-info"
            required
            type="text"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Confirm Password</label>
          <input
            className="update-pass-info"
            required
            type="text"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <button onClick={handleSubmit}>Update</button>
      </form>
      {
        loading && <Loader/>
      }
    </div>
  );
};

export default MeUpdatePassword;
