import React, { useEffect, useRef, useState } from "react";
import "./me.scss";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../redux/toolkits/userSlice";
import axios from "axios";
const Me = () => {
    const dispatch = useDispatch();
    const { data: user } = useSelector((state) => state.userState);
    const userData = user.user ?? [];

    const [active, setActive] = useState(1);
    const [notificationCount, setNotificationCount] = useState(0);

    const handleSetActive = (e) => {
        setActive(e.target.id);
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                await dispatch(getUser()).unwrap();
            } catch (err) {
                console.log(err.response.data.message);
            }
        };
        getUsers();
        const getNotification = async () => {
            const res = await axios.get("/api/v1/summary/notifications");
            setNotificationCount(res.data.admin + res.data.order);
        };
        getNotification();
    }, []);

    return (
        <div className="app__container fake__height">
            <div className="grid wide">
                <div className="row sm-gutter product__wrap">
                    <div className="col l-2 m-0 c-0">
                        <span className="say__hi">
                            Xin chào, {userData.name}
                        </span>
                        <div className="control--account">
                            <h2 className="control--account__heading">
                                Quản lý tài khoản
                            </h2>
                            <ul className="control--account__list">
                                <li className="control--account__list--item">
                                    <Link
                                        className={
                                            1 == active ? ` show--active` : ""
                                        }
                                        to="profile"
                                        onClick={handleSetActive}
                                        id={1}
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                </li>
                                <li className="control--account__list--item">
                                    <Link
                                        to="address"
                                        onClick={handleSetActive}
                                        className={
                                            2 == active ? ` show--active` : ""
                                        }
                                        id={2}
                                    >
                                        Địa chỉ
                                    </Link>
                                </li>
                                <li className="control--account__list--item">
                                    <Link
                                        to="order"
                                        className={
                                            3 == active ? ` show--active` : ""
                                        }
                                        id={3}
                                        onClick={handleSetActive}
                                    >
                                        Đơn hàng
                                    </Link>
                                </li>
                                <li className="control--account__list--item">
                                    <Link
                                        className={
                                            4 == active ? ` show--active` : ""
                                        }
                                        id={4}
                                        to="notification"
                                        onClick={handleSetActive}
                                    >
                                        Thông báo{" "}
                                        {notificationCount
                                            ? `(${notificationCount})`
                                            : ""}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="control--account">
                            <h2 className="control--account__heading">
                                Sản phẩm
                            </h2>
                            <ul className="control--account__list">
                                {/* <li className='control--account__list--item'><Link to="favourite">Sản phẩm yêu thích</Link></li> */}
                                <li className="control--account__list--item">
                                    <Link to="/mycard">Giỏ hàng</Link>
                                </li>
                                <li className="control--account__list--item">
                                    <Link to="/myorder">Đơn hàng của tôi</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Me;
