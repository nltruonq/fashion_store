import React from 'react'
import { Link } from 'react-router-dom'
import earth from '../../assets/img/logo-earth.svg'
import { Outlet } from 'react-router-dom'
import './footer.scss'
const footer = () => {
  return (
    <>
    <footer className="footer__second">
      <div className="grid wide">
        <div className="row">
          <div className="col l-6">
            <div className="footer__second--img-logo">
              <img src={earth} alt="the earth" className="footer__second--img-logo-img"/>
                <span className="footer__second--img-logo-span">FS-COMPANY</span>
            </div>
            <p className="footer__second-para">Fashion Store</p>
            <p className="footer__second-para"><strong> Địa chỉ </strong>: Ho Chi Minh City </p>
            <p className="footer__second-para"><strong> Điện thoại </strong>: 0337995967 / Gmail:lynguyen06122021@gmail.com</p>
            <p className="footer__second-para"><strong> Giờ làm việc </strong>: Sáng 6h30 - 11h45 / Trưa 12h30 -
              5h45</p>

          </div>
          <div className="col l-6">
            <div className="row">
              <div className="col l-4">
                <h3 className="footer__second--heading-sc">Liên kết nhanh</h3>
                <ul className="footer__second--list-sc">
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Trang chủ</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Giới thiệu</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Dự án</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Liên hệ</Link></li>
                </ul>
              </div>
              <div className="col l-4">
                <h3 className="footer__second--heading-sc">Dự án nổi bật</h3>
                <ul className="footer__second--list-sc">
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Liên kết với LAZADA</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Tạo connect với Mỹ</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Developer</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Tuyển dụng 15 Tester</Link></li>
                  <li className="footer__second--item-sc"><Link to="#"
                    className="footer__second--item-link-sc">Tạo ra sản phẩm AI</Link></li>
                </ul>
              </div>
              <div className="col l-4">
                <h3 className="footer__second--heading-sc">Đăng kí nhận tin mới</h3>
                <p className="footer__second-para">Xin vui lòng để lại địa chỉ Email, chúng tôi sẽ cập nhật
                  những thông tin mới tới quý khách</p>
                <input type="text" className="footer__second--input" placeholder="Họ và tên" />
                <input type="text" className="footer__second--input" placeholder="Email" />
                <button className="btn primary-btn btn-btn-footer">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
      <Outlet />
    </>
  )
}

export default footer