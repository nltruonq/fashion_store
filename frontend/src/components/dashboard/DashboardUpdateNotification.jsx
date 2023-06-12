import React, { useEffect, useState } from "react";
import "./dashboardCreateProduct.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
    createNotification,
    getSingleNotification,
    updateNotification,
} from "../../redux/toolkits/notificationSlice";
import Loader from "../loader/Loader";

const DashBoardUpdateNotification = () => {
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
                const data = await dispatch(getSingleNotification(id)).unwrap();
                setTitle(data.notification.title);
                setContent(data.notification.content);
                setShortContent(data.notification.shortContent);
            } catch (err) {}
        };
        getNotification();
    }, [keyFresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (1) {
            try {
                await dispatch(
                    updateNotification({
                        id,
                        title,
                        content,
                        shortContent,
                        type,
                    })
                ).unwrap();
                history("/dashboard/notifications");
                toast.success("Thông báo vừa được tạo thành công");
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
                    <div className="flex-1 mr-[10px]">
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
                <button
                    className="flex justify-center items-center border-[#fff] text-[#fff] bg-[#333] border-[1px] rounded-[3px] border-solid p-[20px] font-[600] text-[14px] w-[50%] m-auto flex items-center h-[45px] hover:bg-[#3d464d] hover:border-[#3d464d] hover:text-[#fff]"
                    onClick={handleSubmit}
                >
                    <span>CẬP NHẬT</span>
                </button>
            </form>
            {loading && <Loader />}
        </div>
    );
};

export default DashBoardUpdateNotification;
