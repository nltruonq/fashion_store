import React, { useState } from "react";
import "./dashboardCreateProduct.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../redux/toolkits/notificationSlice";
import Loader from "../loader/Loader";

const DashBoardCreateNotification = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [shortContent, setShortContent] = useState("");
    const [type, setType] = useState("normal");

    const { loading } = useSelector((state) => state.productState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (1) {
            try {
                await dispatch(
                    createNotification({
                        title,
                        content,
                        shortContent,
                        type,
                    })
                ).unwrap();
                history("/dashboard/notifications");
                toast.success("Thông báo mới vừa được tạo thành công");
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
                <div className="form-group ">
                    <div className="form-group__align">
                        <label htmlFor="title">Tiêu đề</label>
                    </div>
                    <textarea
                        className="input__dashboard textarea__dashboard"
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
                        <label htmlFor="content">Nội dung thông báo</label>
                    </div>
                    <textarea
                        className="textarea__dashboard input__dashboard"
                        required
                        type="text"
                        placeholder="Nội dung thông báo..."
                        id="content"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="shortContent">Nội dung ngắn</label>
                    </div>
                    <textarea
                        className="textarea__dashboard input__dashboard"
                        required
                        type="text"
                        placeholder="Nội dung ngắn..."
                        id="shortContent"
                        value={shortContent}
                        onChange={(e) => {
                            setShortContent(e.target.value);
                        }}
                    />
                </div>

                <button className="btn" onClick={handleSubmit}>
                    TẠO MỚI
                </button>
            </form>
            {loading && <Loader />}
        </div>
    );
};

export default DashBoardCreateNotification;
