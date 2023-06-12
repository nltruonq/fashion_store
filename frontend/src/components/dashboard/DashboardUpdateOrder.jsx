import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import "./dashboardUpdateOrder.scss";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { getSingleOrder, updateOrder } from "../../redux/toolkits/orderSlice";
import { convertOrderStatus } from "../../utils/convertOrderStatus";

const DashboardUpdateOrder = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [keyFresh, setKeyFresh] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const [time, setTime] = useState("");
    const [shippingInfo, setShippingInfo] = useState([]);
    const [status, setStatus] = useState("");

    const { loading } = useSelector((state) => state.orderState);

    useEffect(() => {
        const getOrder = async () => {
            const data = await dispatch(getSingleOrder(id)).unwrap();
            setOrder(data.order);
            setTime(data.order.createdAt.slice(0, 10));
            setOrderItems(data.order.orderItems);
            setShippingInfo(data.order.shippingInfo);
        };
        getOrder();
    }, [keyFresh]);

    const handleUpdate = async () => {
        try {
            if (status !== "") {
                await dispatch(updateOrder({ id, status })).unwrap();
                toast.success("Đơn hàng vừa được cập nhật!");
                history("/dashboard/orders");
            } else {
                toast.error("Vui lòng chọn trạng thái đơn hàng!");
            }
        } catch (error) {
            toast.error("Vui lòng chọn đúng trạng thái đơn hàng!");
        }
    };
    return (
        <>
            <div className="col l-7">
                <div className="wrap--product__order">
                    <div className="heading--time">
                        <h3>
                            Đặt hàng vào lúc: <span>{time}</span>
                        </h3>
                    </div>
                    <div className="wrap--main">
                        <div className="products">
                            <h2>Chi tiết sản phẩm</h2>
                            {orderItems.map((item, i) => (
                                <div
                                    className="wrap--product__order--twice"
                                    key={i}
                                >
                                    <div className="products__image">
                                        <img src={item.image} alt="order" />
                                    </div>
                                    <div className="products__info">
                                        <div className="products__info--name">
                                            <h4>
                                                {item.name}{" "}
                                                <span>x{item.quantity}</span>
                                            </h4>
                                        </div>
                                        <div className="products__info--price">
                                            <h4>
                                                Giá:{" "}
                                                <span>
                                                    {Math.floor(item.price)
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
                                    <li>Địa chỉ: {shippingInfo.address}</li>
                                    <li>
                                        Số điện thoại: {shippingInfo.phoneNo}
                                    </li>
                                    <li>
                                        Tình trạng đơn hàng:{" "}
                                        <span className="order-status">
                                            {convertOrderStatus(
                                                order.orderStatus
                                            )}
                                        </span>
                                    </li>
                                </ul>
                                <h2>Thông tin sản phẩm</h2>
                                <ul>
                                    <li>
                                        Tạm tính (sản phẩm){" "}
                                        <span>
                                            {Math.floor(order.itemsPrice)
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
                                            {Math.floor(order.shippingPrice)
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
                                            TỔNG TIỀN <span>(Tiền mặt)</span>
                                        </h2>{" "}
                                        <span>
                                            {Math.floor(order.totalPrice)
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
            <div className="col l-3 select-status">
                <h1>Cập nhật trạng thái</h1>
                <select
                    name="update"
                    id=""
                    onChange={(e) => {
                        setStatus(e.target.value);
                    }}
                >
                    {/* <option value="">Chọn trạng thái</option> */}
                    <option
                        selected={
                            order.orderStatus === "PENDING" ? true : false
                        }
                        value="PENDING"
                    >
                        Đã đặt hàng
                    </option>
                    <option
                        selected={
                            order.orderStatus === "CONFIRMED" ? true : false
                        }
                        value="CONFIRMED"
                    >
                        Đã xác nhận
                    </option>
                    <option
                        selected={
                            order.orderStatus === "PROCESSING" ? true : false
                        }
                        value="PROCESSING"
                    >
                        Đang xử lý
                    </option>
                    <option
                        selected={
                            order.orderStatus === "DELIVERING" ? true : false
                        }
                        value="DELIVERING"
                    >
                        Đang vận chuyển
                    </option>
                    <option
                        selected={
                            order.orderStatus === "COMPLETED" ? true : false
                        }
                        value="COMPLETED"
                    >
                        Đã hoàn tất
                    </option>
                    <option
                        selected={order.orderStatus === "CANCEL" ? true : false}
                        value="CANCEL"
                    >
                        Hủy đơn hàng
                    </option>
                </select>
                <button className="btn" onClick={handleUpdate}>
                    Cập nhật
                </button>
            </div>
            {loading && <Loader />}
        </>
    );
};

export default DashboardUpdateOrder;
