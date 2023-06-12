import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboardProducts.scss";
import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
    getProductRedux,
    deleteSingleProduct,
    deleteMutipleProduct,
} from "../../redux/toolkits/productSlice";

const DashboardProducts = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [countSelected, setCountSelected] = useState(0);
    const [keyFresh, setKeyFresh] = useState(0);
    const [arrayId, setArrayId] = useState([]);

    const { loading } = useSelector((state) => state.productState);

    useEffect(() => {
        //get products
        const getProducts = async () => {
            let params = { resultPerPage: 1000 };
            try {
                const product = await dispatch(
                    getProductRedux(params)
                ).unwrap();
                setProducts(product.products);
                setIsLoading(true);
            } catch (err) {}
        };
        getProducts();
    }, [keyFresh]);

    //delete product
    const handleDeleteProduct = async (row) => {
        try {
            await dispatch(deleteSingleProduct(row._id)).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Sản phẩm vừa xóa thành công");
            setCountSelected(0);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    const columns = [
        {
            name: "Ảnh",
            selector: (row) => {
                return (
                    <img
                        style={{
                            width: "70px",
                            height: "70px",
                            marginTop: "10px",
                            marginBottom: "10px",
                        }}
                        src={row?.images[0]?.url}
                        alt=""
                    />
                );
            },
            style: (row) => ({ flex: "unset", width: "150px" }),
        },
        {
            name: "Tên sản phẩm",
            selector: (row) => row.name.toString(),
            sortable: true,
            style: (row) => ({ flex: "unset", width: "340px" }),
        },
        {
            name: "Số lượng",
            selector: (row) => row.Stock.toString(),
            sortable: true,
        },
        {
            name: "Mức giá",
            selector: (row) => {
                return `${Math.floor(row.price)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`.toString();
            },
            sortable: true,
        },
        {
            name: "Chức năng",
            selector: (row) => (
                <div className="action--item">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#169c9f" }}
                        onClick={() => {
                            history(`/dashboard/update/product/${row._id}`);
                        }}
                    >
                        Sửa
                    </button>
                    <button
                        className="btn"
                        style={{ backgroundColor: "#169c9f" }}
                        onClick={() => {
                            handleDeleteProduct(row);
                        }}
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];
    const handleSelectedChange = (state) => {
        setCountSelected(state.selectedCount);
        let array = [];
        state.selectedRows.forEach((item, i) => {
            array.push(item._id);
        });
        setArrayId(array);
    };

    const tableData = {
        columns,
        data: products,
    };

    const handleDeleteMutiple = async () => {
        let params = {
            id: arrayId,
        };
        try {
            await dispatch(deleteMutipleProduct(params)).unwrap();
            setKeyFresh((oldv) => oldv + 1);
            toast.success("Sản phẩm vừa xóa thành công");
            setCountSelected(0);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };
    return (
        <div className="col l-10">
            {
                //<DataTableExtensions {...tableData}>
                <DataTable
                    title="Danh sách sản phẩm"
                    columns={columns}
                    data={products}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    selectableRows
                    selectableRowsHighlight={false}
                    onSelectedRowsChange={handleSelectedChange}
                    actions={
                        <div>
                            <button
                                className="btn"
                                style={{ backgroundColor: "#169c9f" }}
                                onClick={handleDeleteMutiple}
                            >
                                Xóa ({countSelected}){" "}
                            </button>
                        </div>
                    }
                />
                //</div></DataTableExtensions>
            }
            {loading && <Loader />}
        </div>
    );
};

export default DashboardProducts;
