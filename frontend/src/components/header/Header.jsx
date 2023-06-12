import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/cart-logo-main.svg";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { getProductRedux } from "../../redux/toolkits/productSlice";
import { getUser, logout } from "../../redux/toolkits/userSlice";
import { deleteCartUser, getMyCarts } from "../../redux/toolkits/cartSlice";
import { deleteOneSignalunSub } from "../../api/onesignalController";
import axios from "axios";

const Header = () => {
    const dispatch = useDispatch();
    let isAuthenticated = localStorage.getItem("isAuthenticated");

    const [refreshKey, setRefreshKey] = useState(0); //set render
    const [products, setProducts] = useState([]);
    const [productsName, setProductsName] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const historyRef = useRef(null);
    const closeRef = useRef(null);

    const historySearchRef = useRef(null);

    const [keyword, setKeyword] = useState("");
    const historySearch =
        JSON.parse(localStorage.getItem("history_search")) || [];
    const [historyCard, setHistoryCard] = useState(
        historySearch.slice().reverse()
    );

    const { data: carts } = useSelector((state) => state.cartState);
    const productCart = carts.cartItems ?? [];
    useEffect(() => {
        if (isAuthenticated) {
            const getCarts = async () => {
                await dispatch(getMyCarts()).unwrap();
            };
            getCarts();
        }
    }, [refreshKey, dispatch]);

    useEffect(() => {
        const getProducts = async () => {
            let params = {
                resultPerPage: 1000,
            };
            try {
                const product = await dispatch(
                    getProductRedux(params)
                ).unwrap();
                setProducts(product.products);
            } catch (err) {}
        };
        getProducts();
        const getNotification = async () => {
            const { data } = await axios.get("/api/v1/notifications", {});
            setNotificationCount(data.notifications.length);
            setNotifications(data.notifications);
        };
        getNotification();
    }, []);

    const history = useNavigate();
    const searchSubmitHandler = useCallback(() => {
        historyRef.current.value = "";
        historySearchRef.current.style.display = "none";
        historyRef.current.focus();
        if (keyword.trim()) {
            history(`/product/${keyword}`);
            if (historySearch) {
                localStorage.setItem(
                    "history_search",
                    JSON.stringify([...historySearch, keyword])
                );
            } else {
                localStorage.setItem(
                    "history_search",
                    JSON.stringify([keyword])
                );
            }
        } else {
            history("/");
        }
        historySearchRef.current.value = "";
    }, [keyword, history, historySearch]);
    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13 && keyword !== "") {
                searchSubmitHandler();
                historyRef.current.focus();
                historySearchRef.current.style.display = "none";
            }
        };
        document.addEventListener("keyup", enterEvent);
        return () => {
            document.removeEventListener("keyup", enterEvent);
        };
    }, [keyword, searchSubmitHandler]);

    const handleSetFinding = (e) => {
        e.preventDefault();
        setKeyword(e.target.value);
        historySearchRef.current.style.display = "block";
        setHistoryCard(historySearch);

        let historyCards = [];
        if (keyword !== "" && keyword !== null) {
            let productNames = [];
            products.forEach((product, i) => {
                productNames.push(product.name);
                setProductsName(productNames);
                historyCards = productsName.filter((data, i) => {
                    return data
                        .toLocaleLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .startsWith(
                            keyword
                                .toLocaleLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                        );
                });
            });
            setHistoryCard(historyCards);
        } else {
            setHistoryCard(historySearch);
        }
    };
    const handleCheckoutHistory = (e, data) => {
        e.preventDefault();
        historyRef.current.value = data;
        historyRef.current.focus();
        setKeyword(data);
    };

    const handleClickResults = (e) => {
        e.preventDefault();
        historySearchRef.current.style.display = "block";
    };
    const handleOnChange = (e) => {
        setKeyword(e.target.value);
    };
    const refreshKeyword = () => {
        if (keyword !== "") {
            setKeyword("");
            historySearchRef.current.focus();
        } else {
            historySearchRef.current.style.display = "none";
        }
    };

    //get data user
    const { data: users } = useSelector((state) => state.userState);
    const user = users.user ?? [];
    const avatar = users.user && users.user?.avatar?.url;
    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                await dispatch(getUser()).unwrap();
            }
        };
        getUsers();
    }, [isAuthenticated]);

    //logout
    const handleLogout = async (e) => {
        e.preventDefault();
        await dispatch(logout()).unwrap();
        localStorage.removeItem("isAuthenticated");
        const oneSignalId = localStorage.getItem("oneSignalId.bmd");
        await deleteOneSignalunSub(oneSignalId);
        history("/account/login");
    };

    //get cart

    //delete cart

    const handleDeleteCartItem = async (id) => {
        if (isAuthenticated) {
            try {
                await dispatch(deleteCartUser({ newArrayId: id })).unwrap();
                setRefreshKey((oldKey) => oldKey + 1);
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    };

    return (
        <>
            <header className="header">
                <div className="grid wide">
                    <div className="header__navbar hide-on-mobile-tablet">
                        <ul className="header__navbar-list">
                            <li className="header__navbar-item">
                                <span className="header__navbar-no--cursor">
                                    <Link
                                        to="#"
                                        className="header__navbar-item-link"
                                    >
                                        {" "}
                                        Liên hệ chúng tôi
                                    </Link>
                                </span>
                                <a
                                    href="https://www.facebook.com/n472002"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="header__navbar-icon-link"
                                >
                                    <i className="header__navbar-icon fab fa-facebook"></i>
                                </a>
                                <a
                                    href="https://www.instagram.com/"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="header__navbar-icon-link"
                                >
                                    <i className="header__navbar-icon fab fa-instagram"></i>
                                </a>
                            </li>
                        </ul>
                        <ul className="header__navbar-list">
                            <li className="header__navbar-item header_notify-hover">
                                <Link
                                    to="#"
                                    className="header__navbar-item-link"
                                >
                                    <div className="header__navbar-icon-link">
                                        <i className="header__navbar-icon far fa-bell"></i>
                                    </div>
                                    <div className="header__navbar-item-link ">
                                        {" "}
                                        Thông báo{" "}
                                        {notificationCount
                                            ? `(${notificationCount})`
                                            : ""}
                                    </div>
                                </Link>
                                <div className="header_notify">
                                    <header className="header-notification">
                                        <h3>Thông báo mới</h3>
                                    </header>
                                    {notifications?.length > 0 ? (
                                        <>
                                            <ul className="header_notify-list">
                                                {notifications.map(
                                                    (item, i) => (
                                                        <li
                                                            key={i}
                                                            className="header_notify-item header_notify-item-hover "
                                                        >
                                                            <Link
                                                                to={`/me/notification/`}
                                                                className="header_notify-link"
                                                            >
                                                                <img
                                                                    src="https://shop.bmdapp.store/assets/vote.74271675.jpg"
                                                                    alt=""
                                                                    className="header_notify-img"
                                                                />
                                                                <div className="header_notify-info">
                                                                    <span className="header_notify-decribe">
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </span>
                                                                    <span className="header_notify-view">
                                                                        {
                                                                            item.content
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <footer className="header__notify-footer">
                                                <Link
                                                    to="/me/notification"
                                                    className="header__notify-footer--link"
                                                >
                                                    Xem tất cả
                                                </Link>
                                            </footer>
                                        </>
                                    ) : (
                                        <div className="image--cart__notfound">
                                            <h3>Chưa có thông báo</h3>
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className="header__navbar-item">
                                <Link
                                    to="#"
                                    className="header__navbar-item-link"
                                >
                                    <div className="header__navbar-icon-link">
                                        <i className="header__navbar-icon far fa-question-circle"></i>
                                    </div>
                                    <div className="header__navbar-item-link">
                                        Trợ giúp
                                    </div>
                                </Link>
                            </li>
                            {isAuthenticated ? (
                                <li className="header__navbar-user">
                                    <img
                                        src={avatar}
                                        alt=""
                                        className="header__navbar-user-img"
                                    />
                                    <span className="header__navbar-user-name">
                                        {user.name}
                                    </span>
                                    <ul className="header__navbar-user-list">
                                        <li className="header__navbar-user-item">
                                            <Link to="/me/profile">
                                                Thông tin tài khoản
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link to="/me/order">
                                                Đơn đặt hàng
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link to="/me/notification">
                                                Thông báo{" "}
                                                {notificationCount
                                                    ? `(${notificationCount})`
                                                    : ""}
                                            </Link>
                                        </li>
                                        <li className="header__navbar-user-item">
                                            <Link to="/mycard">Giỏ hàng</Link>
                                        </li>
                                        {user?.role == "admin" && (
                                            <li className="header__navbar-user-item">
                                                <Link to="/dashboard/main">
                                                    Trang quản trị
                                                </Link>
                                            </li>
                                        )}
                                        <li className="header__navbar-user-item">
                                            <Link
                                                to="/account/login"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <>
                                    <li className="header__navbar-item login">
                                        <Link
                                            to="/account/login"
                                            className="header__navbar-item-link"
                                        >
                                            <div className="header__navbar-item-link">
                                                Đăng nhập
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="header__navbar-item">
                                        <Link
                                            to="/account/register"
                                            className="header__navbar-item-link"
                                        >
                                            <div className="header__navbar-item-link">
                                                Đăng ký
                                            </div>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="header__with--search">
                        <input
                            type="checkbox"
                            hidden
                            id="header__search--catechoose"
                            className="header__search-cate-input"
                        />
                        <div className="header__menu">
                            <label htmlFor="header__search--catechoose">
                                <i className="fas fa-window-close header__menu--icon"></i>
                            </label>

                            <ul className="header__menu--list">
                                <h4 className="header__search--cate-heading">
                                    <i className="fas fa-globe-asia header__menu--link--icon header__menu--link--icon-control"></i>
                                    Menu
                                </h4>
                                <li className="header__menu--item">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-sign-in-alt header__menu--link--icon"></i>
                                        <span>Đăng nhập</span>
                                    </Link>
                                </li>
                                <li className="header__menu--item header__menu--link--icon-active">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-home header__menu--link--icon "></i>
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li className="header__menu--item">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-gift header__menu--link--icon"></i>
                                        <span>Mã giảm giá</span>
                                    </Link>
                                </li>
                                <li className="header__menu--item">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-cart-plus header__menu--link--icon"></i>
                                        <span>Giỏ hàng</span>
                                    </Link>
                                </li>
                                <li className="header__menu--item">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-address-card header__menu--link--icon"></i>
                                        <span>Giới thiệu</span>
                                    </Link>
                                </li>
                                <li className="header__menu--item">
                                    <Link to="#" className="header__menu--link">
                                        <i className="fas fa-user-md header__menu--link--icon"></i>
                                        <span>Cơ hội việc làm</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <label
                            htmlFor="header__search--catechoose"
                            className="header__search-cate"
                        >
                            <i className="fas fa-bars header__search-cate-icon "></i>
                        </label>
                        <label
                            htmlFor="header__search--catechoose"
                            className="overlay--header"
                        ></label>

                        <div className="header__search--img">
                            <Link to="/" className="header__search--img--link">
                                <img
                                    src={Logo}
                                    className="header__search--logo-img"
                                    alt="Anh da nhiem"
                                />
                            </Link>
                        </div>
                        <div className="header__search--find">
                            <div className="header__search--filler">
                                <input
                                    // onFocus={handleSetFinding}
                                    onClick={handleClickResults}
                                    ref={historyRef}
                                    value={keyword}
                                    onInput={handleSetFinding}
                                    onChange={handleOnChange}
                                    type="text"
                                    className="header__search-text"
                                    placeholder="Nhập để tìm kiếm"
                                />
                                {keyword && (
                                    <div ref={closeRef} className="close-upp">
                                        <i
                                            onClick={refreshKeyword}
                                            className="fa-solid fa-xmark"
                                        ></i>
                                    </div>
                                )}
                                {keyword && (
                                    <div
                                        ref={historySearchRef}
                                        className="header__history"
                                    >
                                        <h3 className="header__history--text">
                                            Lịch sử Tìm kiếm
                                        </h3>
                                        <ul className="header__history-list">
                                            {
                                                historyCard?.length > 0
                                                    ? historyCard
                                                          .slice(0, 4)
                                                          .map((history, i) => (
                                                              <li
                                                                  onClick={(
                                                                      e
                                                                  ) => {
                                                                      handleCheckoutHistory(
                                                                          e,
                                                                          history
                                                                      );
                                                                  }}
                                                                  key={i}
                                                                  className="header__history-item"
                                                              >
                                                                  <Link
                                                                      to="#"
                                                                      className="header__history--link"
                                                                  >
                                                                      {history}
                                                                  </Link>
                                                              </li>
                                                          ))
                                                    : ""
                                                //   <li className="header__history-item">
                                                //   <Link to="#" className="header__history--link">
                                                //     Bạn chưa tìm kiếm gì cả.
                                                //   </Link>
                                                // </li>
                                            }
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={searchSubmitHandler}
                                className="btn primary-btn header__search--finding"
                            >
                                <i className="fas fa-search header__search--finding-item"></i>
                            </button>
                        </div>
                        <div className="header__cart">
                            <i className="fas fa-shopping-cart header__cart--icon"></i>
                            {productCart.length > 0 && (
                                <span className="header__cart--sum ">
                                    {productCart.length}
                                </span>
                            )}
                            <div className="header__cart--message header__cart--hascart">
                                {/* <!-- <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png" alt="Ảnh" className="header__cart--img-product">
                    <span className="header__cart--img-text">
                      Chưa có sản phẩm
                    </span> --> */}
                                <h3 className="header__cart--header ">
                                    <span className="header__cart--item-price-name-p">
                                        Các Sản Phẩm Đã Thêm
                                    </span>
                                </h3>
                                {productCart?.length > 0 ? (
                                    <>
                                        <ul className="header__cart--list">
                                            {productCart.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="header__cart--list-item"
                                                >
                                                    <img
                                                        src={
                                                            item.product
                                                                .images[0].url
                                                        }
                                                        alt="anh San Pham"
                                                        className="header__cart--list-item-img"
                                                    />
                                                    <div className="header__cart--item-info">
                                                        <div className="header__cart--item-price">
                                                            <h5 className="header__cart--item-price-name">
                                                                <span className="header__cart--item-price-name-text">
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                </span>
                                                            </h5>
                                                            <span className="header__cart--item-price-price">
                                                                <span className="header__cart--item-price-name-text">
                                                                    {Math.floor(
                                                                        (item
                                                                            .product
                                                                            .price -
                                                                            (item
                                                                                .product
                                                                                .price *
                                                                                item
                                                                                    .product
                                                                                    .sale) /
                                                                                100) *
                                                                            item.quantity
                                                                    )
                                                                        .toString()
                                                                        .replace(
                                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                                            ","
                                                                        )}
                                                                    đ
                                                                </span>
                                                            </span>
                                                            <span className="header__cart--item-price-mutiply">
                                                                <span className="header__cart--item-price-name-text">
                                                                    x
                                                                </span>
                                                            </span>
                                                            <span className="header__cart--item-price-number">
                                                                <span className="header__cart--item-price-name-text">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="header__cart--item-classNameify">
                                                            <span className="header__cart--item-classNameify-name">
                                                                <span className="header__cart--item-price-name-text">
                                                                    Phân loại:{" "}
                                                                    {
                                                                        item
                                                                            .product
                                                                            .category
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="header__cart--item-classNameify-remove">
                                                                <span
                                                                    className="header__cart--item-price-name-text-delete"
                                                                    onClick={() => {
                                                                        handleDeleteCartItem(
                                                                            item
                                                                                .product
                                                                                ._id
                                                                        );
                                                                    }}
                                                                >
                                                                    Xóa
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="header__cart--list-button">
                                            <button className="btn primary-btn header__cart--list-button-hover">
                                                <Link to="/mycard">
                                                    Xem giỏ hàng
                                                </Link>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="image--nocart">
                                        <img
                                            src="data:image/png;base64,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"
                                            alt=""
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
