import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../header/Header";
import Loader from "../../loader/Loader";

import { useDispatch, useSelector } from "react-redux";

import "./login.scss";
import { login } from "../../../redux/toolkits/userSlice";
import { getMyCarts } from "../../../redux/toolkits/cartSlice";
import { getUser } from "../../../redux/toolkits/userSlice";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { postOneSignalSub } from "../../../api/onesignalController";

const Login = () => {
    const dispatch = useDispatch();
    localStorage.removeItem("isAuthenticated");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useNavigate();

    const { loading } = useSelector((state) => state.userState);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(login({ email, password }))
                .unwrap()
                .then((result) => {
                    localStorage.setItem(
                        "isAuthenticated",
                        JSON.stringify(result.token)
                    );
                    axios.defaults.headers = {
                        token: result.token,
                    };

                    history("/");
                    dispatch(getUser());
                    toast.success("Đăng nhập thành công!");
                });
            await postOneSignalSub(localStorage.getItem("oneSignalId.bmd"));
        } catch (err) {
            toast.error("Đăng nhập thất bại!");
        }
    };

    const handleLoginFace = async (res) => {
        try {
            const { data } = await axios.post("/api/v1/login/facebook", {
                facebookId: res.id,
                email: res.email,
                name: res.name,
                avatar: res.picture.data.url,
            });
            localStorage.setItem("isAuthenticated", JSON.stringify(data.token));
            axios.defaults.headers = {
                token: data.token,
            };
            await postOneSignalSub(localStorage.getItem("oneSignalId.bmd"));
            history("/");
            dispatch(getUser());
            toast.success("Đăng nhập thành công!");
        } catch (err) {
            console.log(err);
            toast.error("Đăng nhập thất bại!");
        }
    };

    return (
        // <div className='login'>
        //   <form className='form-login' onSubmit={(e) => { handleSubmit(e) }}>
        //     <div className="form-group">
        //       <label >Email</label>
        //       <input type="email" placeholder='Email...' value={email} onChange={(e) => { setEmail(e.target.value) }} />
        //     </div>
        //     <div className="form-group">
        //       <label >Password</label>
        //       <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
        //     </div>
        //     <button type='submit' onClick={(e) => {handleSubmit(e)}}>Login</button>
        //   </form>
        // </div>
        <>
            <div className="login-screen">
                <form onSubmit={handleSubmit} className="login-screen__form">
                    <h3 className="login-screen__form__title">Đăng nhập 💙</h3>
                    <div className="form-group">
                        <div className="form-group__align">
                            <label htmlFor="email">Email:</label>
                        </div>
                        <input
                            type="email"
                            required
                            id="email"
                            placeholder="Nhập email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            tabIndex={1}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-group-remaining">
                            <div className="form-group__align">
                                <label htmlFor="password">Mật khẩu:</label>
                            </div>
                            <input
                                type="password"
                                required
                                id="password"
                                autoComplete="true"
                                placeholder="Nhập mật khẩu..."
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                tabIndex={2}
                            />
                        </div>
                        <Link
                            to="/account/password/forgot"
                            className="login-screen__forgotpassword"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="form-submit">
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="btn"
                        >
                            Đăng nhập
                        </button>
                    </div>

                    <span className="login-screen__subtext">
                        Chưa có tài khoản?{" "}
                        <Link to="/account/register" target="_self">
                            Đăng kí
                        </Link>
                    </span>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{ marginRight: "10px" }}
                            className="login-screen__subtext"
                        >
                            Hoặc đăng nhập với{" "}
                        </span>
                        <FacebookLogin
                            appId="745390787144298"
                            onFail={(error) => {
                                console.log("Login Failed!", error);
                            }}
                            onProfileSuccess={(response) => {
                                handleLoginFace(response);
                            }}
                            className="face-icon"
                            style={{
                                backgroundColor: "#4267b2",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "5px 10px",
                                border: "none",
                                borderRadius: "4px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            children="Facebook"
                        />
                    </div>
                </form>
                {loading && <Loader />}
            </div>
        </>
    );
};

export default Login;
