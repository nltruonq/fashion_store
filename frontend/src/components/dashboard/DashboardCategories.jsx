import React, { useEffect, useState } from "react";
import "./dashboardOrders.scss";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import axios from "axios";
const DashboardCategories = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [keyFresh, setKeyFresh] = useState(0);
    const [countSelected, setCountSelected] = useState(0);
    const [arrayId, setArrayId] = useState([]);

    const [categories, setCategories] = useState([]);

    const { loading } = useSelector((state) => state.orderState);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axios.get("/api/v1/admin/categories");
                setCategories(data.categories);
                console.log(data.categories);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getCategories();
    }, [keyFresh]);

    const handleDeleteCategory = async (row) => {
        try {
            await axios.delete(`/api/v1/admin/category/${row._id}`);
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Danh mục vừa được xóa thành công!");
            setCountSelected(0);
        } catch (error) {
            console.log(error.data.response.message);
            toast.error("Danh mục chưa được xóa!");
        }
    };

    const columns = [
        {
            name: "Tên danh mục",
            selector: (row) => row.title,
            style: (row) => ({ flex: "unset", width: "270px" }),
        },
        {
            name: "Mô tả cụ thể",
            selector: (row) => row.description,
            sortable: true,
            style: {
                flex: "unset",
                width: "270px",
            },
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
                        style={{ backgroundColor: "#169c9f", color: "white" }}
                        className="btn"
                        onClick={() => {
                            history(`/dashboard/update/category/${row._id}`);
                        }}
                    >
                        Sửa
                    </button>
                    <button
                        style={{ backgroundColor: "#169c9f", color: "white" }}
                        className="btn"
                        onClick={() => {
                            handleDeleteCategory(row);
                        }}
                    >
                        Xóa
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
        data: categories,
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
                    data={categories}
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
                                style={{
                                    backgroundColor: "#169c9f",
                                    color: "white",
                                }}
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

export default DashboardCategories;
