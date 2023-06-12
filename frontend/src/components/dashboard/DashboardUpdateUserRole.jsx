import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./dashboardUpdateUserRole.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
    getSingleUser,
    updateUserRole,
} from "../../redux/toolkits/userAdminSlice";
import Loader from "../loader/Loader";

const DashboardUpdateUserRole = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [address, setAddress] = useState([]);
    const [avt, setAvt] = useState([]);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");

    const { loading } = useSelector((state) => state.userAdminState);

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await dispatch(getSingleUser(id)).unwrap();
                setUser(data.user);
                setAddress(data.user.address);
                setAvt(data.user.avatar.url);
                setEmail(data.user.email);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getUser();
    }, []);

    const handleUpdateRole = async () => {
        try {
            if (role !== "") {
                await dispatch(updateUserRole({ id, email, role })).unwrap();
                toast.success("Thay đổi vai trò thành công!");
                history("/dashboard/users");
            }
        } catch (error) {
            toast.error(`Vai trò chưa được thay đổi!`);
        }
    };
    return (
        <>
            <div className="col l-7">
                <div>
                    <div className="wrap--user__info">
                        <div className="user--info">
                            <div className="img--user">
                                <img src={avt} alt="anh dai dien" />
                            </div>
                            <div className="user--info__para">
                                <h3>{user.name}</h3>
                                <h4>Email: {user.email}</h4>
                                <h4>
                                    Số điện thoại:{" "}
                                    {user.phone
                                        ? user.phone
                                        : "Chưa có số điện thoại"}
                                </h4>
                            </div>
                            <div className="user--info__more">
                                <h4>
                                    Địa chỉ:{" "}
                                    {address.length > 0
                                        ? address[0]
                                        : "Chưa có địa chỉ"}
                                </h4>
                                <h4>
                                    Quyền:{" "}
                                    {user.role == "admin" ? "ADMIN" : "USER"}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col l-2 select-status">
                <h1>Cập nhật trạng thái</h1>
                <select
                    name="update"
                    id=""
                    onChange={(e) => {
                        setRole(e.target.value);
                    }}
                >
                    <option
                        selected={user.role === "admin" ? "ADMIN" : "USER"}
                        value="admin"
                    >
                        ADMIN
                    </option>
                    <option value="user">USER</option>
                </select>
                <button className="btn" onClick={handleUpdateRole}>
                    Cập nhật
                </button>
            </div>
            {loading && <Loader />}
        </>
    );
};

export default DashboardUpdateUserRole;
