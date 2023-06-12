
import React from 'react'
import { Link } from 'react-router-dom'
import './cartItem.scss'

const CardItem = ({productCart}) => {

    return (
        <div className="cart-info">
            <img src={productCart.images[0].url} alt="Anh" />
            <div className="cart-info--wrap">
                <Link to={`/product/detail/${productCart._id}`} className='info-name'>
                    <h2>{productCart.name}</h2>
                    <h3>{productCart.description}</h3>
                </Link>
                <div className="info-action">
                    <div className='info-action--price'>{Math.floor((Number(productCart.price) * (100 - Number(productCart.sale)) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                    <div className="product-info__deal--item--discount">
                          <span>{productCart.sale}% GIẢM</span>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default CardItem