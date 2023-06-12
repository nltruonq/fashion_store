import React, { useEffect, useState } from "react";
import "./dashboardCreateProduct.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import axios from "axios";

const DashBoardUpdateCategory = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [shortContent, setShortContent] = useState("");
    const [type, setType] = useState("normal");
    const [keyFresh, setKeyFresh] = useState(0);

    const { id } = useParams();

    const { loading } = useSelector((state) => state.productState);

    useEffect(() => {
        const getNotification = async () => {
            try {
                const { data } = await axios.get(
                    `/api/v1/admin/category/${id}`
                );
                setTitle(data.category.title);
                setContent(data.category.description);
            } catch (err) {}
        };
        getNotification();
    }, [keyFresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (1) {
            try {
                await axios.put(`/api/v1/admin/category/${id}`, {
                    title,
                    description: content,
                });
                history("/dashboard/categories");
                toast.success("Danh mục sản phẩm vừa được cập nhật thành công");
            } catch (error) {
                console.log(error.response.data.message);
            }
        } else {
            toast.error(`Vui lòng nhập đầy đủ và chính xác thông tin!`);
        }
    };

    return (
        <div className="col l-10 create-product flex-1">
            <form action="name" onSubmit={handleSubmit}>
                <div className="form-group flex justify-between items-center">
                    <div className="form-group__align">
                        <label htmlFor="title">Tiêu đề</label>
                    </div>
                    <input
                        className="input__dashboard"
                        required
                        type="text"
                        placeholder="Tiêu đề..."
                        id="title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="content">Mô tả cụ thể</label>
                    </div>
                    <textarea
                        className="textarea__dashboard input__dashboard"
                        required
                        type="text"
                        placeholder="Mô tả cụ thể..."
                        id="content"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                    />
                </div>
                <button className="btn" onClick={handleSubmit}>
                    <span>CẬP NHẬT</span>
                </button>
            </form>
            {loading && <Loader />}
        </div>
    );
};

export default DashBoardUpdateCategory;
