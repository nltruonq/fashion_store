import React, { useState, useEffect } from "react";
import axios from "axios";
import "./meProfile.scss";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader";

import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../redux/toolkits/userSlice";

const MeProfile = () => {
  const dispatch = useDispatch();

  const {data: users} = useSelector(state => state.userState)
  const user = users.user ?? []
  const avatar = users.user?.avatar.url ?? ''
  // const date = users.user?.createAt ?? ''

  useEffect(() => {
    const getUsers = async () => {
      try {
        await dispatch(getUser()).unwrap()
    
      } catch(err) {
        console.log(err.response.data.message);
      }
    };
    getUsers();
  }, []);
  return (
    <div className="col l-10 m-12 c-12 index__profile">
        <>
          <div className="index__profile--heading">
            <h1 className="index__profile--heading--item">Thông tin cá nhân</h1>
          </div>
          <div className="wrap__info">
            <div className="contain__img">
              <div>
                <img src={avatar} alt="" />
              </div>
            </div>
            <div className="row sm-gutter">
              <div className="col l-4 set__height">
                <div className="index__profile--content--item">
                  <h3 className="index__profile--content-heading">Họ tên</h3>
                  <div className="index__profile--content-info">
                    {user.name}
                  </div>
                </div>
              </div>
              <div className="col l-4 set__height">
                <div className="index__profile--content--item">
                  <h3 className="index__profile--content-heading">
                    Địa chỉ email
                  </h3>
                  <div className="index__profile--content-info">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="col l-4 set__height">
                <div className="index__profile--content--item">
                  <h3 className="index__profile--content-heading">
                    Số điện thoại
                  </h3>
                  <div className="index__profile--content-info">
                    {user.phone ? (
                      user.phone
                    ) : (
                      <span>Vui lòng nhập số điện thoại của bạn</span>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="col l-4 set__height">
          <div className="index__profile--content--item">
            <h3 className='index__profile--content-heading'>Ngày sinh</h3>
            <div className="index__profile--content-info">
            {user.date ? user.date : <span>Vui lòng nhập số ngày sinh của bạn</span>}
            </div>
          </div>
        </div> */}
              <div className="col l-4 set__height">
                <div className="index__profile--content--item">
                  <h3 className="index__profile--content-heading">Giới tính</h3>
                  <div className="index__profile--content-info">
                    {user.sex ? (
                      user.sex === 2 ? (
                        "Nữ"
                      ) : (
                        "Nam"
                      )
                    ) : (
                      <span>Vui lòng nhập số giới tính của bạn</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="contain__button">
              <Link to="/me/update" className="btn">
                SỬA THÔNG TIN
              </Link>
              <Link to="/me/password" className="btn">
                THAY ĐỔI MẬT KHẨU
              </Link>
            </div>
          </div>
        </>
      
    </div>
  );
};

export default MeProfile;
