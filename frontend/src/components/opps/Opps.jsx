import React from 'react'
import { Link } from 'react-router-dom'
import './oops.scss'

const Opps = () => {
  return (
    <div className='page__notfound'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh70ECb_iregZPsGWEys2lePbkneHAbtnHJQ&usqp=CAU" alt="" />
        <Link to="/" className='btn '>QUAY LẠI TRANG CHỦ</Link >
    </div>
  )
}

export default Opps