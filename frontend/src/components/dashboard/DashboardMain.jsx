import React, { useState, useEffect } from "react";
import "./dashboardMain.scss";
import { Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getAllUser } from "../../redux/toolkits/userAdminSlice";
import { getProductRedux } from "../../redux/toolkits/productSlice";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { convertOrderStatus } from "../../utils/convertOrderStatus";
import { listOrderStatus } from "../../utils/listOrderStatus";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const handleFindOrderStatus = (status, arr) => {
    let data = {
        _id: status,
        count: 0,
    };
    for (const item of arr) {
        if (item._id == status) {
            data = item;
            break;
        }
    }
    return data;
};
const DashboardMain = () => {
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrder] = useState([]);
    const [summaryOrder, setSummaryOrder] = useState([]);

    useEffect(() => {
        //get order
        const getOrder = async () => {
            try {
                const { data } = await axios.get("/api/v1/orders/me");
                setOrder(data.orders);
                setIsLoading(true);
            } catch (error) {
                console.log(error.response.data.error);
            }
        };
        getOrder();

        //get products
        const getProducts = async () => {
            const params = {
                resultPerPage: 1000,
            };
            try {
                const product = await dispatch(
                    getProductRedux(params)
                ).unwrap();
                setProducts(product.products);
                setIsLoading(true);
            } catch (err) {}
        };
        getProducts();

        //get users
        const getUsers = async () => {
            try {
                await dispatch(getAllUser())
                    .unwrap()
                    .then((user) => {
                        setUsers(user.users);
                    });
            } catch (err) {}
        };
        getUsers();

        const getSummary = async () => {
            const { data } = await axios.get("/api/v1/group/orders");
            console.log(data.data);
            setSummaryOrder(data.data);
        };
        getSummary();
    }, []);

    //get user

    let totalAmount = 0;
    orders &&
        orders.forEach((item) => {
            totalAmount += item.totalPrice;
        });
    const lineState = {
        // labels: ["Initial Amount", "Amount Earned"],
        labels: [
            "Tháng 2",
            "Tháng 4",
            "Tháng 6",
            "Tháng 8",
            "Tháng 10",
            "Tháng 12",
        ],
        datasets: [
            {
                label: "TỔNG DOANG THU",
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                // data: [0, totalAmount],
                data: [
                    1500202,
                    2489000,
                    9462821,
                    8402832,
                    15528293,
                    totalAmount,
                ],
            },
            // {
            //   label: "Second dataset",
            //   data: [33, 25, 35, 51, 54, 76],
            //   fill: false,
            //   borderColor: "#742774"
            // }
        ],
    };

    let outOfStock = 0;

    products &&
        products.forEach((item) => {
            if (item.Stock === 0) {
                outOfStock += 1;
            }
        });

    const doughnutState = {
        labels: ["Hết hàng", "Còn hàng"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock],
            },
        ],
    };

    return (
        // <Line options={options} data={data} />
        <div className="col l-10">
            {isLoading ? (
                <>
                    <h1
                        className="title__dashboard"
                        style={{ marginTop: "3rem", marginBottom: "3rem" }}
                    >
                        THÔNG SỐ ĐƠN HÀNG
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            margin: "auto",
                            width: "900px",
                            marginBottom: "5rem",
                            border: "1px solid #999",
                            borderRadius: "3px",
                        }}
                    >
                        {listOrderStatus?.map((item, i) => (
                            <Link
                                to={"/dashboard/orders"}
                                className="hoverListOrderStatus"
                                style={{
                                    width: "170px",
                                    height: "170px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "20px 0px",
                                    color: "black",
                                    textDecoration: "unset",
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: "24px",
                                        color: "hwb(205 6% 9%)",
                                    }}
                                >
                                    {
                                        handleFindOrderStatus(
                                            item,
                                            summaryOrder
                                        )?.count
                                    }
                                </h4>
                                <h5
                                    style={{
                                        fontWeight: "500",
                                        fontSize: "13px",
                                    }}
                                >
                                    {convertOrderStatus(
                                        handleFindOrderStatus(
                                            item,
                                            summaryOrder
                                        )?._id
                                    )}
                                </h5>
                            </Link>
                        ))}
                    </div>

                    <div
                        className="chart__dashboard"
                        style={{ marginTop: "4rem", marginInline: "4rem" }}
                    >
                        <div className="lineChart">
                            <h1>BẢNG THỐNG KÊ DOANH THU</h1>
                            <Line data={lineState} />
                        </div>
                        {/* <div className="doughnutChart">
              <h1>BIỂU ĐỒ THỐNG KÊ SẢN PHẨM</h1>
              <Doughnut data={doughnutState} />
            </div> */}
                    </div>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default DashboardMain;
