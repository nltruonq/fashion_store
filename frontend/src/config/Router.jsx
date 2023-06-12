import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductSearch from "../components/product/productSearch/ProductSearch";
import Login from "../components/authentication/login/Login";
import Home from "../pages/home/Home";
import Register from "../components/authentication/register/Register";
import MeUpdatePassword from "../components/authentication/meUpdatePassword/MeUpdatePassword";
import Forgot from "../components/authentication/forgot/Forgot";
import ResetPassword from "../components/authentication/resetPassword/ResetPassword";
import ProductDetail from "../components/product/productDetail/ProductDetail";
import MyCard from "../components/cart/myCard/MyCard";
import MyOrder from "../components/order/MyOrder";
import Opps from "../components/opps/Opps";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import Shop from "../components/shop/Shop";
const Router = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    return (
        <Routes>
            <Route path="/product/:keywordss" element={<ProductSearch />} />
            {/* <Route path='/me/update' element={<MeUpdate />}/> */}
            <Route path="/product/detail/:id" element={<ProductDetail />} />

            <Route
                path="/mycard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MyCard />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Home />} />
            <Route path="/myorder/:id" element={<MyOrder />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<Opps />} />
        </Routes>
    );
};

export default Router;
