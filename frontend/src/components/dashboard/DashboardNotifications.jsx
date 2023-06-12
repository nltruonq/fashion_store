import React, { useEffect, useState } from "react";
import "./dashboardOrders.scss";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteSingleNotification,
    getNotificationRedux,
} from "../../redux/toolkits/notificationSlice";
import Loader from "../loader/Loader";
import axios from "axios";
import { deleteSinglenotification } from "../../api/notificationApi";

const DashboardNotifications = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [keyFresh, setKeyFresh] = useState(0);
    const [countSelected, setCountSelected] = useState(0);
    const [arrayId, setArrayId] = useState([]);

    const [orders, setOrders] = useState([]);

    const { loading } = useSelector((state) => state.orderState);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await dispatch(getNotificationRedux()).unwrap();
                setOrders(data.notifications);
                console.log(data.notifications);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getNotifications();
    }, [keyFresh]);

    const handleDeleteNotification = async (row) => {
        try {
            await dispatch(deleteSingleNotification(row._id)).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Thông báo vừa được xóa thành công!");
            setCountSelected(0);
        } catch (error) {
            console.log(error.data.response.message);
            toast.error("Thông báo chưa được xóa!");
        }
    };

    const handlePushNotification = async (row) => {
        try {
            await axios.post("/api/v1/push/user/all", {
                notificationId: row._id,
            });
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Thông báo được gửi thành công!");
            setCountSelected(0);
        } catch (error) {
            toast.error("Thông báo được gửi không thành công!");
        }
    };

    const columns = [
        {
            name: "Tiêu đề",
            selector: (row) => row.title,
        },
        {
            name: "Nội dung",
            selector: (row) => row.content,
            sortable: true,
        },
        {
            name: "Nội dung ngắn",
            selector: (row) => row.shortContent,
            sortable: true,
        },
        {
            name: "Tạo lúc",
            selector: (row) => row.createdAt.slice(0, 10),
            sortable: true,
        },
        {
            name: "Chức năng",
            selector: (row) => (
                <div className="action--item">
                    <button
                        style={{ backgroundColor: "#169c9f" }}
                        className="btn p-[10px] bg-green-500 mr-[5px] rounded-[4px] font-[600] text-[14px] text-white"
                        onClick={() => {
                            history(
                                `/dashboard/update/notification/${row._id}`
                            );
                        }}
                    >
                        Sửa
                    </button>
                    <button
                        className="btn p-[10px] bg-red-500 mr-[5px] rounded-[4px] font-[600] text-[14px] text-white"
                        style={{ backgroundColor: "#169c9f" }}
                        onClick={() => {
                            handleDeleteNotification(row);
                        }}
                    >
                        Xóa
                    </button>
                    <button
                        className="btn p-[10px] bg-black rounded-[4px] font-[600] text-[14px] text-white"
                        style={{ backgroundColor: "#169c9f", color: "white" }}
                        onClick={() => {
                            handlePushNotification(row);
                        }}
                    >
                        Gửi
                    </button>
                </div>
            ),
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: "62px !important", // override the row height
                flex: "0",
            },
        },
    };

    const tableData = {
        columns,
        data: orders,
    };

    const handleSelectedChange = (state) => {
        setCountSelected(state.selectedCount);
        let array = [];
        state.selectedRows.forEach((item, i) => {
            array.push(item._id);
        });
        setArrayId(array);
    };
    const handleDeleteMutiple = async () => {
        try {
            //   await dispatch(deleteMutipleOrder({ id: arrayId })).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Đơn hàng vừa được xóa thành công!");
            setCountSelected(0);
        } catch (error) {
            toast.error("Đơn hàng chưa được xóa!");
        }
    };

    return (
        <div className="col l-10 flex-1 mr-[2rem]">
            {
                //  <DataTableExtensions {...tableData} >
                <DataTable
                    title="Danh sách thông báo"
                    columns={columns}
                    data={orders}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    selectableRows
                    customStyles={customStyles}
                    selectableRowsHighlight={false}
                    onSelectedRowsChange={handleSelectedChange}
                    actions={
                        <div>
                            <button
                                style={{ backgroundColor: "#169c9f" }}
                                className="btn"
                                onClick={handleDeleteMutiple}
                            >
                                Xóa ({countSelected}){" "}
                            </button>
                        </div>
                    }
                    dense
                />

                // </DataTableExtensions>
            }
            {loading && <Loader />}
        </div>
    );
};

export default DashboardNotifications;
