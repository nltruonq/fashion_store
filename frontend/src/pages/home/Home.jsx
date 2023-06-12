import React from "react";

import Header from "../../components/header/Header";
import "./home.scss";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import Shop from "../../components/shop/Shop";

const IMAGES = [
    "https://res.cloudinary.com/nghia285diem/image/upload/v1655100632/images_frontend/hero-1_bf7gkc.jpg",
    "https://res.cloudinary.com/nghia285diem/image/upload/v1655100635/images_frontend/hero-2_sns3xy.jpg",
];

const Home = () => {
    SwiperCore.use([Autoplay]);

    return (
        <>
            <Shop />
        </>
    );
};

export default Home;
