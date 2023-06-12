import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../../loader/Loader";
import ProductList from "../productList/ProductList";
import ConfirmOrder from "../../order/ConfirmOrder";
import io from "socket.io-client";

import "./productDetail.scss";
import CardDetail from "./CardDetail";
import CommentItem from "./CommentItem";
import ReportComent from "./ReportComent";
import { useRef } from "react";

import { useDispatch } from "react-redux";
import { getUser } from "../../../redux/toolkits/userSlice";
import { getSingleProduct } from "../../../redux/toolkits/productSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../header/Header";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);

    const [isDisplay, setIsDisplay] = useState(false);

    const [keyFresh, setKeyFresh] = useState(0);

    const isAuthenticated = localStorage.getItem("isAuthenticated");

    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState([]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingCmt, setIsLoadingCmt] = useState(false);

    const [number, setNumber] = useState(1);

    const handleDecrease = () => {
        if (number <= 1) {
            return;
        }
        setNumber(number - 1);
    };
    const handleIncrease = () => {
        if (number >= product.Stock) {
            return;
        }
        setNumber(number + 1);
    };

    const [productComment, setProductComment] = useState([]);

    const [user, setUser] = useState([]);
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                try {
                    const users = await dispatch(getUser()).unwrap();
                    setUser(users.user);
                    setUserImage(users.user.avatar.url);
                } catch (err) {
                    console.log(err.response.data);
                }
            }
        };
        getUsers();
    }, [isAuthenticated]);

    // const ENDPOINT = "https://nghia-store.herokuapp.com";
    const ENDPOINT = "http://localhost:5000";
    // const ENDPOINT = "https://store-ndn.herokuapp.com";
    useEffect(() => {
        if (isAuthenticated) {
            const socket = io(ENDPOINT);
            setSocket(socket);
            return () => socket.close();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", id);
        }
    }, [socket, id]);

    //get product
    useEffect(() => {
        const getProduct = async () => {
            let results = null;
            results = await dispatch(getSingleProduct(id)).unwrap();
            setProduct(results.product);
            setImages(results.product.images);
            setIsLoading(true);
            if (results && isAuthenticated) {
                results = await axios.get(`/api/v1/reviews?id=${id}`);
                setProductComment(results.data.reviews);
                setIsLoadingCmt(true);
            } else {
                setIsLoadingCmt(true);
            }
        };
        getProduct();
    }, [id, isAuthenticated]);

    const [send, setSend] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating > 0 && comment !== "") {
            const createdAt = new Date().toISOString();

            socket.emit("createComment", {
                rating,
                comment,
                productId: id,
                createdAt,
                send,
                user: user._id,
                name: user.name,
            });
            setRating(0);
            setComment("");
            // setKeyFresh((old) => old + 1);
        } else {
            // setKeyFresh((old) => old + 1);
            toast.error("Vui lòng nhập đầy đủ thông tin!");
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("sendCommentToClient", (msg) => {
                setProductComment(msg);
                return () => socket.off("sendCommentToClient");
            });
        }
    }, [productComment, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("sendReplyCommentToClient", (msg) => {
                setProductComment(msg);
                return () => socket.off("sendReplyCommentToClient");
            });
        }
    }, [productComment, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("sendUpdateReplyToClient", (msg) => {
                setProductComment(msg);
                return () => socket.off("sendUpdateReplyToClient");
            });
        }
    }, [productComment, socket]);

    const handleClickScrollTop = () => {
        document.body.scrollTop(0);
        document.documentElement.scrollTop(0);
    };

    const [isShowReport, setIsShowReport] = useState(undefined);

    const reportRef = useRef(null);

    useEffect(() => {
        if (isShowReport) {
            reportRef.current.classList.add("show");
        }
    }, [isShowReport]);

    return (
        <>
            <Header />
            <div className="app-detail">
                <div className="grid wide">
                    <div className="row small-gutter  app__content">
                        {isLoading ? (
                            <CardDetail
                                isDisplay={isDisplay}
                                setIsDisplay={setIsDisplay}
                                images={images}
                                product={product}
                                handleDecrease={handleDecrease}
                                handleIncrease={handleIncrease}
                                number={number}
                            />
                        ) : (
                            <Loader />
                        )}
                        <div className="reviews">
                            <div className="review__heading">
                                <h2>Đánh giá và nhận xét của {product.name}</h2>
                            </div>
                            <div className="review__add">
                                <div className="review__add--info">
                                    <h1>Thêm đánh giá</h1>
                                </div>
                                <div className="review__add--ratings">
                                    {/* <Rating
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    size="large"
                    name="rating"
                  /> */}
                                </div>
                                <div className="fix-flex">
                                    <textarea
                                        wrap="true"
                                        cols={20}
                                        rows={10}
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        placeholder="Nhập vào đánh giá của bạn..."
                                        spellCheck={false}
                                        type="text"
                                    />
                                    <button
                                        className="btn"
                                        onClick={(e) => {
                                            setSend("");
                                            handleSubmit(e);
                                        }}
                                    >
                                        Đánh giá
                                    </button>
                                </div>
                            </div>
                            <div className="review__show">
                                {isLoadingCmt ? (
                                    productComment.length > 0 &&
                                    productComment
                                        .slice(0, 5)
                                        .map((cmt, i) => (
                                            <CommentItem
                                                id={id}
                                                socket={socket}
                                                user={user}
                                                key={i}
                                                userImage={userImage}
                                                cmt={cmt}
                                                isShowReport={isShowReport}
                                                setIsShowReport={
                                                    setIsShowReport
                                                }
                                            />
                                        ))
                                ) : (
                                    <Loader />
                                )}
                            </div>
                        </div>
                        <div className="section__header mb-2">
                            <div className="header__trending">
                                <h2>Sản Phẩm phổ biến</h2>
                            </div>
                            <Link to="/" onClick={handleClickScrollTop}>
                                <button className="btn">Xem Thêm</button>
                            </Link>
                        </div>
                        <ProductList />
                    </div>
                </div>

                <ConfirmOrder
                    isOne={true}
                    product={product}
                    quantity={number}
                    isDisplay={isDisplay}
                    setIsDisplay={setIsDisplay}
                />
                <ReportComent
                    ref={reportRef}
                    isShowReport={isShowReport}
                    setIsShowReport={setIsShowReport}
                    socket={socket}
                />
            </div>
        </>
    );
};

export default ProductDetail;
