import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import ProductCard from "../productCard/ProductCard";
import "./productSearch.scss";
import Loader from "../../loader/Loader";
import { useNavigate } from "react-router-dom";

import Header from '../../header/Header'
import { useDispatch } from "react-redux";
import { getProductRedux } from "../../../redux/toolkits/productSlice";

const ProductSearch = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const btnActive = useRef(null);
  const btnMoiNhat = useRef(null);
  const btnBanChay = useRef(null);

  const [sort, setSort] = useState(5);
  const [productsCount, setProductCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { keywordss } = useParams();

  useEffect(() => {
    setIsLoading(false);
    const getProducts = async (keywordss, currentPage) => {
      let params = {};
      try {
        if (keywordss) {
          params = {
            keyword: keywordss,
            sort,
            resultPerPage,
          };
          if (currentPage) {
            params = {
              page: currentPage,
              keyword: keywordss,
              resultPerPage,
              sort,
            };
          }
          try {
            const product = await dispatch(getProductRedux(params)).unwrap();
            setProducts(product.products);
            setResultPerPage(product.resultPerPage);
            setCount(product.filteredProductsCount);
            setProductCount(product.productsCount);
            setIsLoading(true);
          } catch (err) {}
        }
      } catch (error) {
        history('/')
      }
      setIsLoading(true);
    };
    getProducts(keywordss, currentPage);
  }, [keywordss, sort, currentPage]);

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

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  return (
    <>
    <Header />
      <div className="home-container">
        <div className="grid wide">
          <div className="product--control">
            <div className="product--wrap">
              <h2>
                Xuất hiện <span>{products.length || 0}</span> kết quả với từ
                khóa <span>"{keywordss}"</span>
              </h2>
              <div className="col l-7 m-12 c-12  ">
                <div className="content__home hide-on-mobile-tablet">
                  <span className="content__arrange">Sắp xếp theo</span>
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
                    <span className="content_option-text">Giá</span>
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
              </div>
            </div>
            {isLoading ? (
              <div className="row">
                {products.length > 0
                  ? products.map((product, i) => (
                      <ProductCard key={i} product={product} />
                    ))
                  : "Khong co san pham nao"}
              </div>
            ) : (
              <Loader />
            )}
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

export default ProductSearch;
