import React, { useRef, useState, useEffect } from "react";
import "./dashboard.scss";
import logo from "../../assets/img/cart-logo-main.svg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const productRef = useRef(null);
    const orderRef = useRef(null);
    const userRef = useRef(null);
    const reviewRef = useRef(null);
    const notificationRef = useRef(null);
    const categoryRef = useRef(null);

    const [user, setUser] = useState([]);
    const [avt, setAvt] = useState("");

    const history = useNavigate();
    const logoutRef = useRef();
    //logout
    const handleLogout = async (e) => {
        e.preventDefault();

        const { data } = await axios.get("/api/v1/logout");
        if (data.success) {
            localStorage.removeItem("isAuthenticated");
            history("/account/login");
            window.location.reload("true");
        }
    };

    //get me info
    useEffect(() => {
        let users = [];
        const getUser = async () => {
            try {
                users = await axios.get("/api/v1/me");
                setUser(users.data.user);
                setAvt(users.data.user.avatar.url);
            } catch (err) {
                history("/account/login");
            }
        };
        getUser();
    }, []);

    const handleToggleLogout = (e) => {
        e.preventDefault();
        logoutRef.current.classList.toggle("show");
    };

    const handleToggleList = (ref) => {
        if (ref !== null) {
            ref.current.classList.toggle("show");
        }
    };
    return (
        <div className="row dashboard">
            <div className="dashboard--header">
                <div className="dashboard--logo">
                    {/* <img src={logo} alt="" /> */}
                    {/* <h1>DASHBOARD</h1> */}
                </div>
                <div onClick={handleToggleLogout} className="dashboard__avt">
                    <img src={avt} alt="" className="header__navbar-user-img" />
                    <span className="header__navbar-user-name">
                        {user.name}
                    </span>
                    <ul ref={logoutRef} className="dashboard__logout--list">
                        <li className="dashboard__logout--list--item">
                            <Link to="/account/login" onClick={handleLogout}>
                                Đăng xuất{" "}
                                <i className="fa-solid fa-right-to-bracket"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="wrap--dashboard">
                <div className="col l-2 main--board">
                    <div className="dashboard__menu">
                        <div className="dashboard__menu--item">
                            <Link to="/">
                                <i className="fa-solid fa-house-user"></i>
                                Trang chủ
                            </Link>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link to="/dashboard/main">
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="area-chart"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    style={{ marginRight: "10px" }}
                                    aria-hidden="true"
                                >
                                    <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-616-64h536c4.4 0 8-3.6 8-8V284c0-7.2-8.7-10.7-13.7-5.7L592 488.6l-125.4-124a8.03 8.03 0 00-11.3 0l-189 189.6a7.87 7.87 0 00-2.3 5.6V720c0 4.4 3.6 8 8 8z"></path>
                                </svg>
                                Dashboard
                            </Link>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link
                                onClick={() => {
                                    handleToggleList(productRef);
                                }}
                                to="#"
                            >
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="account-book"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    style={{ marginRight: "10px" }}
                                    aria-hidden="true"
                                >
                                    <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v584zM639.5 414h-45c-3 0-5.8 1.7-7.1 4.4L514 563.8h-2.8l-73.4-145.4a8 8 0 00-7.1-4.4h-46c-1.3 0-2.7.3-3.8 1-3.9 2.1-5.3 7-3.2 10.9l89.3 164h-48.6c-4.4 0-8 3.6-8 8v21.3c0 4.4 3.6 8 8 8h65.1v33.7h-65.1c-4.4 0-8 3.6-8 8v21.3c0 4.4 3.6 8 8 8h65.1V752c0 4.4 3.6 8 8 8h41.3c4.4 0 8-3.6 8-8v-53.8h65.4c4.4 0 8-3.6 8-8v-21.3c0-4.4-3.6-8-8-8h-65.4v-33.7h65.4c4.4 0 8-3.6 8-8v-21.3c0-4.4-3.6-8-8-8h-49.1l89.3-164.1c.6-1.2 1-2.5 1-3.8.1-4.4-3.4-8-7.9-8z"></path>
                                </svg>
                                Sản phẩm
                            </Link>
                            <ul
                                ref={productRef}
                                className="dashboard__menu--item-list"
                            >
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/create/product">
                                        <i className="fa-solid fa-plus"></i> Tạo
                                        sản phẩm
                                    </Link>
                                </li>
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/products">
                                        <i className="fa-solid fa-border-all"></i>{" "}
                                        DS sản phẩm
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link to="/dashboard/orders">
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="form"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    style={{ marginRight: "10px" }}
                                    aria-hidden="true"
                                >
                                    <path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path>
                                    <path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path>
                                </svg>
                                Đơn hàng
                            </Link>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link to="/dashboard/users">
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="user-switch"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    style={{ marginRight: "10px" }}
                                    aria-hidden="true"
                                >
                                    <defs>
                                        <style></style>
                                    </defs>
                                    <path d="M759 335c0-137-111-248-248-248S263 198 263 335c0 82.8 40.6 156.2 103 201.2-.4.2-.7.3-.9.4-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00136 874.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C356 614.2 431 583 511 583c137 0 248-111 248-248zM511 507c-95 0-172-77-172-172s77-172 172-172 172 77 172 172-77 172-172 172zm105 221h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H703.5l47.2-60.1a8.1 8.1 0 001.7-4.9c0-4.4-3.6-8-8-8h-72.6c-4.9 0-9.5 2.3-12.6 6.1l-68.5 87.1c-4.4 5.6-6.8 12.6-6.8 19.8.1 17.7 14.4 32 32.1 32zm240 64H592c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h176.5l-47.2 60.1a8.1 8.1 0 00-1.7 4.9c0 4.4 3.6 8 8 8h72.6c4.9 0 9.5-2.3 12.6-6.1l68.5-87.1c4.4-5.6 6.8-12.6 6.8-19.8-.1-17.7-14.4-32-32.1-32z"></path>
                                </svg>
                                Tài khoản
                            </Link>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link
                                onClick={() => {
                                    handleToggleList(notificationRef);
                                }}
                                to="#"
                            >
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="bell"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    style={{ marginRight: "10px" }}
                                >
                                    <path d="M816 768h-24V428c0-141.1-104.3-257.7-240-277.1V112c0-22.1-17.9-40-40-40s-40 17.9-40 40v38.9c-135.7 19.4-240 136-240 277.1v340h-24c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h216c0 61.8 50.2 112 112 112s112-50.2 112-112h216c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM512 888c-26.5 0-48-21.5-48-48h96c0 26.5-21.5 48-48 48zM304 768V428c0-55.6 21.6-107.8 60.9-147.1S456.4 220 512 220c55.6 0 107.8 21.6 147.1 60.9S720 372.4 720 428v340H304z"></path>
                                </svg>
                                Thông báo
                            </Link>
                            <ul
                                ref={notificationRef}
                                className="dashboard__menu--item-list"
                            >
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/create/notification">
                                        <i className="fa-solid fa-plus"></i> Tạo
                                        thông báo
                                    </Link>
                                </li>
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/notifications">
                                        <i className="fa-solid fa-border-all"></i>{" "}
                                        DS thông báo
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="dashboard__menu--item">
                            <Link
                                onClick={() => {
                                    handleToggleList(categoryRef);
                                }}
                                to="#"
                            >
                                <i className="fa-solid fa-users"></i>
                                Danh mục
                            </Link>
                            <ul
                                ref={categoryRef}
                                className="dashboard__menu--item-list"
                            >
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/create/category">
                                        <i className="fa-solid fa-plus"></i> Tạo
                                        danh mục
                                    </Link>
                                </li>
                                <li className="dashboard__menu--item-list-item">
                                    <Link to="/dashboard/categories">
                                        <i className="fa-solid fa-border-all"></i>{" "}
                                        DS danh mục
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
