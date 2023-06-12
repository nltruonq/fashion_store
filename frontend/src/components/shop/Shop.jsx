import React, { useEffect, useRef, useState } from "react";
import Pagination from "react-js-pagination";
import Loader from "../loader/Loader";
import ProductCard from "../product/productCard/ProductCard";

import "./shop.scss";

import { useDispatch } from "react-redux";
import { getProductRedux } from "../../redux/toolkits/productSlice";
import Header from "../header/Header";
import axios from "axios";

const Shop = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [productsCount, setProductCount] = useState(1);
    const [resultPerPage, setResultPerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sort, setSort] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const btnActive = useRef(null);
    const btnMoiNhat = useRef(null);
    const btnBanChay = useRef(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setIsLoading(false);
        const getProducts = async (category, currentPage) => {
            let params = {
                sort,
                resultPerPage: 15,
            };
            if (currentPage) {
                params = {
                    page: currentPage,
                    sort: sort,
                    resultPerPage: 15,
                };
            }
            if (category) {
                params = {
                    page: currentPage,
                    category: category,
                    sort,
                    resultPerPage: 15,
                };
            }
            const product = await dispatch(getProductRedux(params)).unwrap();
            setProducts(product.products);
            setProductCount(product.productsCount);
            setResultPerPage(product.resultPerPage);
            setCount(product.filteredProductsCount);
            setIsLoading(true);
        };
        getProducts(category, currentPage, sort);
        const getCategories = async () => {
            try {
                const { data } = await axios.get("/api/v1/admin/categories");
                setCategories(data.categories);
                console.log(data.categories);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getCategories();
    }, [category, currentPage, sort]);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
    function tabs(tab) {
        const tabss = [];
        tabss.push(btnBanChay);
        tabss.push(btnMoiNhat);
        tabss.push(btnActive);
        tabss.forEach((t, i) => {
            tab.classList.add("primary-btn");

            if (t !== tab) {
                t.current.classList.remove("primary-btn");
                tab.classList.add("primary-btn");
            }
        });
    }

    return (
        <>
            <Header />
            <div className="app__container">
                <div className="grid wide">
                    <div className="row sm-gutter app__content">
                        <div className="col l-2 m-0 c-0">
                            <nav className="category">
                                <h3 className="category__heading">
                                    <i className="fas fa-list category__heading-icon"></i>
                                    Danh Mục
                                </h3>
                                <ul className="category__heading--list">
                                    <li
                                        className="category__heading--item"
                                        onClick={() => {
                                            setCategory("");
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {" "}
                                        <span className="category__heading--item-link">
                                            ALL
                                        </span>
                                    </li>
                                    {categories.length > 0
                                        ? categories.map((cate, i) => (
                                              <li
                                                  key={i}
                                                  onClick={() => {
                                                      setCategory(cate._id);
                                                      setCurrentPage(1);
                                                  }}
                                                  className="category__heading--item "
                                              >
                                                  <span className="category__heading--item-link">
                                                      {cate.title}
                                                  </span>
                                              </li>
                                          ))
                                        : ""}
                                </ul>
                            </nav>
                        </div>
                        <div className="col l-10 m-12 c-12  ">
                            <div className="content__home hide-on-mobile-tablet">
                                <span className="content__arrange">
                                    Sắp xếp theo
                                </span>

                                <button
                                    ref={btnActive}
                                    className="btn primary-btn content__arrange-btn"
                                    onClick={() => {
                                        setSort(5);
                                        tabs(btnActive.current);
                                    }}
                                >
                                    Phổ biến
                                </button>
                                <button
                                    ref={btnMoiNhat}
                                    className="btn content__arrange-btn"
                                    onClick={() => {
                                        setSort("");
                                        tabs(btnMoiNhat.current);
                                    }}
                                >
                                    Mới nhất
                                </button>
                                <button
                                    ref={btnBanChay}
                                    className="btn content__arrange-btn"
                                    onClick={() => {
                                        setSort("banchay");
                                        tabs(btnBanChay.current);
                                    }}
                                >
                                    Bán chạy
                                </button>

                                <div className="content__option">
                                    <span className="content_option-text">
                                        Giá
                                    </span>
                                    <i className="fas fa-chevron-down content_option-icon "></i>
                                    <ul className="content__option-list">
                                        <li
                                            className="content__option-item"
                                            onClick={() => {
                                                setSort(-1);
                                            }}
                                        >
                                            Giá: Cao đến thấp
                                        </li>
                                        <li
                                            className="content__option-item"
                                            onClick={() => {
                                                setSort(1);
                                            }}
                                        >
                                            Giá: Thấp đến cao
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="home__product">
                                    <div className="row sm-gutter">
                                        {products.length > 0
                                            ? products.map((product, i) => (
                                                  <ProductCard
                                                      key={i}
                                                      product={product}
                                                  />
                                              ))
                                            : "Khong co san pham nao"}
                                    </div>
                                </div>
                            ) : (
                                <Loader />
                            )}
                        </div>
                        {resultPerPage < count && (
                            <div className="paginationBox">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={Number(resultPerPage)}
                                    totalItemsCount={productsCount}
                                    onChange={setCurrentPageNo}
                                    nextPageText="Next"
                                    prevPageText="Prev"
                                    firstPageText="1st"
                                    lastPageText="Last"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activeClass="pageItemActive"
                                    activeLinkClass="pageLinkActive"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
