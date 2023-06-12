import React, { useState, useEffect } from "react";
import axios from "axios";
import "./productList.scss";

import { SwiperSlide, Swiper } from "swiper/react";
import ProductCard from "../productCard/ProductCard";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { useDispatch } from "react-redux";
import { getProductRedux } from "../../../redux/toolkits/productSlice";
import Loader from "../../loader/Loader";

const ProductList = ({ category }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    const getProducts = async (category) => {
      let params = {};
      if (category) {
        params = {
          resultPerPage: 20,
          category,
        };
      } else {
        params = {
          resultPerPage: 20,
        };
      }
      try {
        const product = await dispatch(getProductRedux(params)).unwrap();
        setProducts(product.products);
        setIsLoading(true);
      } catch (err) {}
    };
    getProducts(category);
  }, [category]);

  return (
    <div style={{ width: "100%" }}>
      {!isLoading ? (
        <Loader />
      ) : (
        <div className="product-list">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            // scrollbar={{ draggable: true }}
            grabCursor={true}
            spaceBetween={1}
            slidesPerView={"auto"}
            // // navigation
            // pagination={{ clickable: true }}
          >
            {products.map((item, i) => (
              <SwiperSlide key={i}>
                <ProductCard product={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductList;
