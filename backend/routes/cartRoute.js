const express = require('express')

const {
    addItemToCart,
    getCartItems,
    removeCartItems,
    updateSelectedAll
} = require('../controller/cartController')

const router = express.Router()

const {
    isAuthenticatedUser
} = require('../middleware/auth')

router.route('/cart').post(isAuthenticatedUser, addItemToCart)
router.route('/cart/items').get(isAuthenticatedUser, getCartItems).post(isAuthenticatedUser, removeCartItems)
router.route('/cart/items/update').post(isAuthenticatedUser, updateSelectedAll)




module.exports = router