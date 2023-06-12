import React, { useEffect, useState } from "react";
import "./assets/css/responsive.css";
import "./App.css";
import "./grid.css";
import { useSelector, useDispatch } from "react-redux";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Router from "./config/Router";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MeUpdate from "./components/my/meUpdate/MeUpdate";
import Me from "./components/my/me/Me";
import { ToastContainer, toast } from "react-toastify";
import MeProfile from "./components/my/meProfile/MeProfile";
import MePassword from "./components/my/mePassword/MePassword";
import MeAddress from "./components/my/meAddress/MeAddress";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardMain from "./components/dashboard/DashboardMain.jsx";
import DashboardProducts from "./components/dashboard/DashboardProducts";
import DashboardUsers from "./components/dashboard/DashboardUsers";
import DashboardOrders from "./components/dashboard/DashboardOrders";
import DashboardCreateProduct from "./components/dashboard/DashboardCreateProduct";
import DashboardUpdateOrder from "./components/dashboard/DashboardUpdateOrder";
import DashboardUpdateProduct from "./components/dashboard/DashboardUpdateProduct";
import DashboardUpdateUserRole from "./components/dashboard/DashboardUpdateUserRole";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MeUpdatePassword from "./components/authentication/meUpdatePassword/MeUpdatePassword";
import Forgot from "./components/authentication/forgot/Forgot";
import { getUser } from "./redux/toolkits/userSlice";
import ResetPassword from "./components/authentication/resetPassword/ResetPassword";
import DashBoardCreateNotification from "./components/dashboard/DashboardCreateNotification";
import DashboardNotifications from "./components/dashboard/DashboardNotifications";
import DashBoardUpdateNotification from "./components/dashboard/DashboardUpdateNotification";
import DashboardCategories from "./components/dashboard/DashboardCategories";
import DashBoardCreateCategory from "./components/dashboard/DashboardCreateCategory";
import DashBoardUpdateCategory from "./components/dashboard/DashboardUpdateCategory";
import axios from "axios";

import runOneSignal from "./onsignal";
import OneSignal from "react-onesignal";
import { deleteOneSignalunSub, postOneSignalSub } from "./api/onesignalController";
import MeOrder from "./components/my/meOrder/MeOrder";
import MeNotification from "./components/my/meNotification/MeNotification";

function WrapComponent({ children }) {
    return children;
}
axios.defaults.baseURL = "https://fashion-store-ildx.onrender.com";
axios.defaults.headers = {
    token: JSON.parse(localStorage.getItem("isAuthenticated")),
};
function App() {
    const dispatch = useDispatch();

    const { data, isAuthenticated } = useSelector((state) => state.userState);

    useEffect(() => {
        dispatch(getUser());
    }, []);

    useEffect(() => {
        runOneSignal();
    });

    OneSignal.on("subscriptionChange", async function (isSubscribed) {
        isSubscribed
            ? await postOneSignalSub(localStorage.getItem("oneSignalId.bmd"))
            : await deleteOneSignalunSub(localStorage.getItem("oneSignalId.bmd"));

        console.log(isSubscribed);
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <WrapComponent>
                            <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
                            {/* <Header /> */}
                            <Router />
                            <Footer />
                        </WrapComponent>
                    }
                ></Route>
                <Route
                    path="me"
                    element={
                        <WrapComponent>
                            <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
                            <Header />
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                {" "}
                                <Me />{" "}
                            </ProtectedRoute>
                        </WrapComponent>
                    }
                >
                    <Route path="profile" element={<MeProfile />} />
                    <Route path="update" element={<MeUpdate />} />
                    <Route path="password" element={<MePassword />} />
                    <Route path="address" element={<MeAddress />} />
                    <Route path="order" element={<MeOrder />} />
                    <Route path="notification" element={<MeNotification />} />
                </Route>
                <Route
                    path="dashboard"
                    element={
                        <WrapComponent>
                            <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
                            <ProtectedRoute adminRoute={true} isAdmin={data} isAuthenticated={isAuthenticated}>
                                {" "}
                                <Dashboard />{" "}
                            </ProtectedRoute>
                        </WrapComponent>
                    }
                >
                    <Route path="main" element={<DashboardMain />} />
                    <Route path="products" element={<DashboardProducts />} />
                    <Route path="users" element={<DashboardUsers />} />
                    <Route path="orders" element={<DashboardOrders />} />
                    <Route path="create/product" element={<DashboardCreateProduct />} />
                    <Route path="update/order/:id" element={<DashboardUpdateOrder />} />
                    <Route path="update/product/:id" element={<DashboardUpdateProduct />} />
                    <Route path="update/user/:id" element={<DashboardUpdateUserRole />} />
                    <Route path="notifications" element={<DashboardNotifications />} />
                    <Route path="create/notification" element={<DashBoardCreateNotification />} />
                    <Route path="update/notification/:id" element={<DashBoardUpdateNotification />} />
                    <Route path="categories" element={<DashboardCategories />} />
                    <Route path="create/category" element={<DashBoardCreateCategory />} />
                    <Route path="update/category/:id" element={<DashBoardUpdateCategory />} />
                </Route>
                <Route
                    path="account"
                    element={
                        <WrapComponent>
                            <ToastContainer className="Toastify" position={toast.POSITION.TOP_RIGHT} autoClose={3000} />
                            <Outlet />
                        </WrapComponent>
                    }
                >
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="updatepassword" element={<MeUpdatePassword />} />
                    <Route path="password/forgot" element={<Forgot />} />
                    <Route path="resetpassword/:token" element={<ResetPassword />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
