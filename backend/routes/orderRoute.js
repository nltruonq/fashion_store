const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
    deleteManyOrder,
    groupOrders,
    payment,
} = require("../controller/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/order/payment-intent").post(isAuthenticatedUser, payment);

router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
router
    .route("/admin/muitiple/order")
    .post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyOrder);

router
    .route("/group/orders")
    .get(isAuthenticatedUser, authorizeRoles("admin"), groupOrders);

module.exports = router;
