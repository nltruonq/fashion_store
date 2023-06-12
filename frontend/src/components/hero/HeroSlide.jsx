import React from "react";

import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "./heroSlide.scss";

const movieItems = ["https://shopfashi.herokuapp.com/images/2021-12-27T12-43-55.972Z-man-large.jpg"];
const HeroSlide = () => {
  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        // autoplay={{ delay: 7000 }}
      >
        {movieItems.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <HeroSlideItem
                item={item}
                className={`${isActive ? "active" : ""}`}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const HeroSlideItem = (props) => {
  return (
    <div
      className={`hero-slide__item ${props.className}`}
      style={{ backgroundImage: `url(${props.item})` }}
    >
      <div className="hero-slide__item__content container">
          <div className="hero-slide__item__content__register">
            <h1>Unlimited movies, TV shows, and more.</h1>
            <h3>Watch anywhere. Cancel anytime.</h3>
          </div>
        {/* <Link
          className="fix-display"
          to={link}
          style={{ position: "relative", zIndex: 100000 }}
        >
          <div className="hero-slide__item__content__poster">
            <img src={apiConfig.w500Image(item.poster_path)} alt="" />
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default HeroSlide;
