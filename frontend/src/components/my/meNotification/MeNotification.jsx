import React, { useState, useEffect } from "react";
import "./meNotification.scss";

import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Link } from "react-router-dom";

const MeNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);
    const [adminTotal, setAdminTotal] = useState(0);

    const [active, setActive] = useState("order");

    useEffect(() => {
        const getNotification = async () => {
            const { data } = await axios.get("/api/v1/notifications", {
                params: { type: active },
            });
            setNotifications(data.notifications);
            const res = await axios.get("/api/v1/summary/notifications");
            setAdminTotal(res.data.admin);
            setOrderTotal(res.data.order);
        };
        getNotification();
    }, [active]);

    return (
        <div className="col l-10 m-12 c-12 index__profile">
            <>
                <div className="index__profile--heading">
                    <h1 className="index__profile--heading--item">
                        Danh sách thông báo
                    </h1>
                </div>
                <div className="wrap__info">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            marginLeft: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <h3
                            onClick={() => setActive("order")}
                            style={{
                                marginRight: "20px",
                                fontWeight: "600",
                                color: "black",
                                padding: "0px 2px",
                                cursor: "pointer",
                                borderBottomWidth: "2px",
                            }}
                            className={`${
                                active === "order"
                                    ? "order_active"
                                    : "order_noactive"
                            }`}
                        >
                            Đơn hàng {orderTotal ? `(${orderTotal})` : ""}
                        </h3>
                        <h3
                            onClick={() => setActive("admin")}
                            style={{
                                marginRight: "20px",
                                fontWeight: "600",
                                color: "black",
                                padding: "0px 2px",
                                cursor: "pointer",
                                borderBottomWidth: "2px",
                            }}
                            className={`${
                                active === "admin"
                                    ? "order_active"
                                    : "order_noactive"
                            }`}
                        >
                            Từ Admin {adminTotal ? `(${adminTotal})` : ""}
                        </h3>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "start",
                            flexDirection: "column",
                            maxHeight: "500px",
                            overflowY: "auto",
                        }}
                    >
                        {notifications.map((item) => (
                            <Link
                                to={
                                    item.type === "order" &&
                                    `/myorder/${item.order._id}`
                                }
                                style={{
                                    cursor:
                                        item.type === "order"
                                            ? "pointer"
                                            : "default",
                                    borderRadius: "5px",
                                }}
                                className="notification_hover"
                            >
                                <img
                                    src="https://shop.bmdapp.store/assets/vote.74271675.jpg"
                                    alt=""
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        marginRight: "20px",
                                    }}
                                    className="mr-[20px]"
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            color: "black",
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <h3
                                        style={{
                                            fontSize: "12px",
                                            marginBottom: "10px",
                                            color: "rgb(228, 87, 62)",
                                        }}
                                    >
                                        {item.content}
                                    </h3>
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            color: "black",
                                        }}
                                    >
                                        {moment
                                            .unix(item.lastSendAt)
                                            .format("HH:mm, DD/MM/YYYY")}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </>
        </div>
    );
};

export default MeNotification;
