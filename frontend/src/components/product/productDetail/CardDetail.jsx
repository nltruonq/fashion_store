import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/img/cart-logo-main.svg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { addCartUser } from "../../../redux/toolkits/cartSlice";
import Loader from "../../loader/Loader";

const CardDetail = ({
    isDisplay,
    setIsDisplay,
    images,
    product,
    handleDecrease,
    handleIncrease,
}) => {
    return (
        <div className="product__content">
            <div className="change-wrap">
                <CardSwiperDetail images={images} />
                <CardInfoDetail
                    product={product}
                    isDisplay={isDisplay}
                    setIsDisplay={setIsDisplay}
                    handleDecrease={handleDecrease}
                    handleIncrease={handleIncrease}
                />
            </div>
            <div className="powered">
                <img src={Logo} alt="Store" />
                <span>Tài trợ bởi DN Store 💙</span>
            </div>
        </div>
    );
};

const CardSwiperDetail = ({ images }) => {
    const [activeThumb, setActiveThumb] = useState();

    return (
        <div className="app__product--detail">
            <div>
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    modules={[Navigation, Thumbs]}
                    grabCursor={true}
                    thumbs={{ swiper: activeThumb }}
                    className="product-images-slider"
                >
                    {images.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={item.url}
                                alt="product images"
                                className="image--main"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Swiper
                    onSwiper={setActiveThumb}
                    loop={true}
                    spaceBetween={9}
                    slidesPerView={images.length}
                    modules={[Navigation, Thumbs]}
                    className="product-images-slider-thumbs"
                >
                    {images.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="product-images-slider-thumbs-wrapper">
                                <img
                                    src={item.url}
                                    alt="product images"
                                    className="image--key"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

const CardInfoDetail = ({
    product,
    isDisplay,
    setIsDisplay,
    handleDecrease,
    handleIncrease,
}) => {
    const dispatch = useDispatch();
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    const history = useNavigate();

    const { loading } = useSelector((state) => state.cartState);

    const handleAddToCart = async (product, quantity) => {
        if (isAuthenticated) {
            try {
                await dispatch(
                    addCartUser({
                        cartItems: [{ product, quantity }],
                    })
                ).unwrap();
                history("/mycard");
            } catch (err) {
                console.log(err.response.data.message);
            }
        } else {
            history("/login");
        }
    };

    const [numbers, setNumbers] = useState(1);

    const handleDecreases = () => {
        if (numbers <= 1) {
            return;
        }
        setNumbers(numbers - 1);
    };
    const handleIncreases = () => {
        if (numbers >= product.Stock) {
            return;
        }
        setNumbers(numbers + 1);
    };

    return (
        <div className="product-info">
            <div className="product-info__name">
                <span className="product-info__name--item">{product.name}</span>
            </div>
            <div className="product-info__about">
                <div className="product-info__about--ratings">
                    {/* <Rating
            {...{
              size: "large",
              value: product.ratings || 0,
              readOnly: true,
              precision: 0.5,
            }}
          /> */}
                </div>
                <div className="product-info__about--reviews">
                    <span className="product-info__about--reviews--item">
                        {product.reviews.length} <span>đánh giá</span>
                    </span>
                </div>
                <div className="product-info__about--sold">
                    <span className="product-info__about--sold--item">
                        {product.sold} <span>đã bán</span>
                    </span>
                </div>
            </div>
            <div className="product-info__deal">
                <div className="product-info__deal--item">
                    <div className="product-info__deal--item--old">
                        Giá cũ:{" "}
                        <span>
                            {product.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            đ
                        </span>
                    </div>
                    <div className="product-info__deal--item--new">
                        Giá mới:{" "}
                        <span>
                            {Math.floor(
                                (product.price * (100 - product.sale)) / 100
                            )
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            đ
                        </span>
                    </div>
                    <div className="product-info__deal--item--discount">
                        <span>{product.sale}% GIẢM</span>
                    </div>
                </div>
            </div>
            <div className="product-info__description">
                Description: <span>✅ {product.description}</span>
            </div>
            <div className="product-info__caculator">
                <div className="product-info--wrap">
                    <div className="product-info__caculator--number">
                        Số lượng
                    </div>
                    <div className="product-info__caculator--plus">
                        <button
                            onClick={() => {
                                handleDecrease();
                                handleDecreases();
                            }}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            onChange={() => {}}
                            value={`${numbers ? numbers : 1}`}
                        />
                        <button
                            onClick={() => {
                                handleIncrease();
                                handleIncreases();
                            }}
                        >
                            +
                        </button>
                    </div>
                    <div className="product-info__caculator--stock">
                        {product.Stock}{" "}
                        <span className="product-info__caculator--stock--real">
                            Sản phẩm có sẵn
                        </span>
                    </div>
                </div>
                <button
                    className="product-info__caculator--cart btn primary-btn"
                    onClick={() => {
                        handleAddToCart(product._id, numbers);
                    }}
                >
                    Thêm Vào Giỏ Hàng
                </button>
                <button
                    className="product-info__caculator--cart btn "
                    onClick={() => {
                        if (isAuthenticated) {
                            setIsDisplay(!isDisplay);
                        } else {
                            history("/login");
                        }
                    }}
                >
                    Mua Hàng
                </button>
            </div>
            {loading && <Loader />}
        </div>
    );
};
export default CardDetail;
