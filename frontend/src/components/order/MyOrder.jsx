import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./myOrder.scss";

import { useDispatch, useSelector } from "react-redux";
import { getOrderUser } from "../../redux/toolkits/orderSlice";
import Header from "../header/Header";
import axios from "axios";

const MyOrder = () => {
    const [order, setOrder] = useState({});
    const { id } = useParams();
    useEffect(() => {
        console.log("1312323123", id);
        const getOrder = async () => {
            const { data } = await axios.get(`/api/v1/order/${id}`);
            console.log(data.order);
            setOrder(data.order);
        };
        getOrder();
    }, []);

    return (
        <>
            <Header />
            <div className="app__container padding--fake">
                <div className="grid wide">
                    <div className="row sm-gutter ">
                        <div className="col l-12">
                            <div className="wrap--product__order">
                                <div className="heading--time">
                                    <h3>
                                        Đặt hàng vào lúc:{" "}
                                        <span>
                                            {order?.createdAt?.slice(0, 10)}
                                        </span>
                                    </h3>
                                </div>
                                <div className="wrap--main">
                                    <div className="products">
                                        <h2>Chi tiết sản phẩm</h2>
                                        {order?.orderItems?.map((item) => (
                                            <div className="wrap--product__order--twice">
                                                <div className="products__image">
                                                    <img
                                                        src={item.image}
                                                        alt="order"
                                                    />
                                                </div>
                                                <div className="products__info">
                                                    <div className="products__info--name">
                                                        <h4>
                                                            {item.name}{" "}
                                                            <span>
                                                                x{item.quantity}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                    <div className="products__info--price">
                                                        <h4>
                                                            Giá:{" "}
                                                            <span>
                                                                {Math.floor(
                                                                    item.price
                                                                )
                                                                    .toString()
                                                                    .replace(
                                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                                        ","
                                                                    )}
                                                                đ
                                                            </span>
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="info--all">
                                        <div className="info--all__heading">
                                            <h2>Thông tin đơn hàng</h2>
                                            <ul>
                                                <li>
                                                    Địa chỉ:{" "}
                                                    {
                                                        order?.shippingInfo
                                                            ?.address
                                                    }
                                                </li>
                                                <li>
                                                    Số điện thoại:{" "}
                                                    {
                                                        order?.shippingInfo
                                                            ?.phoneNo
                                                    }
                                                </li>
                                                <li>
                                                    Tình trạng đơn hàng:{" "}
                                                    <span className="order-status">
                                                        {order?.orderStatus ===
                                                        "Processing"
                                                            ? "Đang giao"
                                                            : order?.orderStatus}
                                                    </span>
                                                </li>
                                            </ul>
                                            <h2>Thông tin sản phẩm</h2>
                                            <ul>
                                                <li>
                                                    Tạm tính (sản phẩm){" "}
                                                    <span>
                                                        {Math.floor(
                                                            order?.itemsPrice
                                                        )
                                                            .toString()
                                                            .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                            )}
                                                    </span>
                                                </li>
                                                <li>
                                                    Phí giao hàng{" "}
                                                    <span>
                                                        {Math.floor(
                                                            order?.shippingPrice
                                                        )
                                                            .toString()
                                                            .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                            )}
                                                        đ
                                                    </span>
                                                </li>
                                                <li>
                                                    Thuế(VAT) <span>10%</span>
                                                </li>
                                                <li>
                                                    <h2>
                                                        TỔNG TIỀN{" "}
                                                        <span>(Tiền mặt)</span>
                                                    </h2>{" "}
                                                    <span>
                                                        {Math.floor(
                                                            order?.totalPrice
                                                        )
                                                            .toString()
                                                            .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                            )}
                                                        đ
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyOrder;
