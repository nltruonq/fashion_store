import React, { useEffect, useState } from "react";
import "./dashboardOrders.scss";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteMutipleOrder,
    deleteSingleOrder,
    getAllOrders,
} from "../../redux/toolkits/orderSlice";
import { convertOrderStatus } from "../../utils/convertOrderStatus";

const DashboardOrders = () => {
    const dispatch = useDispatch();

    const history = useNavigate();
    const [keyFresh, setKeyFresh] = useState(0);
    const [countSelected, setCountSelected] = useState(0);
    const [arrayId, setArrayId] = useState([]);

    const [orders, setOrders] = useState([]);

    const { loading } = useSelector((state) => state.orderState);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await dispatch(getAllOrders()).unwrap();
                setOrders(data.orders);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getOrders();
    }, [keyFresh]);

    const handleDeleteOrder = async (row) => {
        try {
            await dispatch(deleteSingleOrder(row._id)).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Đơn hàng vừa được xóa thành công!");
            setCountSelected(0);
        } catch (error) {
            console.log(error.data.response.message);
            toast.error("Đơn hàng chưa được xóa!");
        }
    };

    const columns = [
        {
            name: "Id",
            selector: (row) => row._id,
        },
        {
            name: "Số sản phẩm",
            selector: (row) => row.orderItems.length,
            sortable: true,
        },
        {
            name: "Tổng tiền",
            selector: (row) => {
                return `${Math.floor(row.totalPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`;
            },
            sortable: true,
        },
        {
            name: "Đặt hàng lúc",
            selector: (row) => row.paidAt.slice(0, 10),
            sortable: true,
        },
        {
            name: "Tiến trình",
            selector: (row) => {
                return convertOrderStatus(row.orderStatus);
            },
        },
        {
            name: "Chức năng",
            selector: (row) => (
                <div className="action--item">
                    <button
                        style={{ backgroundColor: "#169c9f" }}
                        className="btn"
                        onClick={() => {
                            history(`/dashboard/update/order/${row._id}`);
                        }}
                    >
                        Sửa
                    </button>
                    <button
                        style={{ backgroundColor: "#169c9f" }}
                        className="btn"
                        onClick={() => {
                            handleDeleteOrder(row);
                        }}
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

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
            await dispatch(deleteMutipleOrder({ id: arrayId })).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Đơn hàng vừa được xóa thành công!");
            setCountSelected(0);
        } catch (error) {
            toast.error("Đơn hàng chưa được xóa!");
        }
    };

    return (
        <div className="col l-10 ">
            {
                //  <DataTableExtensions {...tableData} >
                <DataTable
                    title="Danh sách đơn hàng"
                    columns={columns}
                    data={orders}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    selectableRows
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

export default DashboardOrders;
