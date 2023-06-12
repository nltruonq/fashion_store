import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./productCard.scss";

const ProductCard = ({ product }) => {
    // const ratingChanged = (newRating) => {
    //   console.log(newRating);
    // };
    const handleScroll = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className="col l-2-4 m-4 c-6  ">
            <Link
                className="home__product--item"
                onClick={handleScroll}
                to={`/product/detail/${product._id}`}
            >
                <div
                    className="home__product--item-img"
                    style={{
                        backgroundImage: `url('${
                            product.images.length > 0
                                ? product.images[0].url
                                : ""
                        }')`,
                    }}
                ></div>
                <h4 className="home__product--item-name">{product.name}</h4>
                <div className="home__product--item-price">
                    <span className="home__product--item-price-old">
                        {product.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        đ
                    </span>
                    <span className="home__product--item-price-current">
                        {Math.floor(
                            (product.price * (100 - product.sale)) / 100
                        )
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        đ
                    </span>
                </div>
                <div className="home__product--item-action">
                    {/* <Rating  {...{
            size: "small",
            value: product.ratings || 0,
            readOnly: true,
            precision: 0.5,
          }} /> */}
                    <span className="home__product--item-sold">
                        {product.sold} đã bán
                    </span>
                </div>
                {/* <div className="home__product--item-favourite">
          <div className="home__product--item-favourite-love">
            <i className="fas fa-check"></i>
            Yêu thích
          </div>
          <div className="home__product--item-favourite-plus">+</div>
        </div> */}
                <div className="home__product--item-sale-off">
                    <span className="home__product--item-sale-off--percent">
                        {product.sale}%
                    </span>
                    <span className="home__product--item-sale-off--lable">
                        GIẢM
                    </span>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
