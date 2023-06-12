const express = require('express')
const {
    createProduct,
    getAllProduct,
    deleteProduct,
    updateProduct,
    getProductDetail,
    createProductReview,
    getProductReviews,
    deleteReview,
    deleteManyProduct
} = require('../controller/productController')
const {isAuthenticatedUser} = require('../middleware/auth')

const {authorizeRoles} = require('../middleware/auth')
const router = express.Router()

router.route('/products').get(getAllProduct)
router.route('/product/:id').get(getProductDetail)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles("admin"), createProduct)
router
    .route('/admin/product/:id')
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route('/admin/muitiple/product').post(isAuthenticatedUser,authorizeRoles("admin"),deleteManyProduct)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReviews).delete(isAuthenticatedUser, deleteReview)


module.exports = router