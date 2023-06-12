const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Notification = require("../models/notificationModel");
const OneSignal = require("../models/oneSignalModel");
const OneSignalUtil = require("../utils/onesignal");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const moment = require("moment/moment");

const stripe = require("stripe")(
    "sk_test_51N7XOIF6Rt3UtzX9HXQsm8JJSK21mhdPQgf8FqcajXdbP7MYsSQUSo3r6fCHn7OzfCMR8vm3XSXIOEWHEsjhyWrx00nwUubMAX"
);
exports.payment = catchAsyncError(async (req, res, next) => {
    const amount = req.body.amount || 0;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "VND",
            amount,
            automatic_payment_methods: { enabled: true },
        });

        // Send publishable key and PaymentIntent details to client
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

// Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
        code: "B" + Math.floor(new Date().valueOf() * Math.random()),
    });

    res.status(201).json({
        success: true,
        order,
    });

    const notification = {
        title: "Tiếp nhận đơn hàng",
        content: `Đơn hàng #${order._id} đã được tiếp nhận.`,
        shortContent: `Đơn hàng #${order._id} đã được tiếp nhận.`,
        mode: `private`,
        user: req.user._id,
        order: order._id,
        from: "admin",
        type: "order",
        mode: "private",
        lastSendAt: moment().unix(),
    };

    await Notification.create(notification);

    const oneSignals = await OneSignal.find({ user: req.user._id }).populate([
        "user",
    ]);

    if (oneSignals.length) {
        await OneSignalUtil.pushNotification({
            heading: "Tiếp nhận đơn hàng",
            content: `Đơn hàng #${order._id} đã được tiếp nhận.`,
            data: {
                type: "ORDER",
                orderId: order._id + "",
            },
            oneSignalPlayerIds: oneSignals.map((e) => e.oneSignalId),
            pathUrl: "/account/orders",
        });
    }

    const notificationAdmin = {
        title: "Đơn hàng mới",
        content: `Đơn hàng #${order._id} vừa được tạo.`,
        shortContent: `Đơn hàng #${order._id} vừa được tạo.`,
        mode: `private`,
        user: req.user._id,
        order: order._id,
        from: "customer",
        type: "order",
        mode: "private",
        lastSendAt: moment().unix(),
    };
    await Notification.create(notificationAdmin);

    const oneSignalsAdmin = await OneSignal.find({
        "user.role": "admin",
    }).populate(["user"]);

    if (oneSignalsAdmin.length) {
        await OneSignalUtil.pushNotification({
            heading: "Đơn hàng mới",
            content: `Đơn hàng #${order._id} vừa được tạo`,
            data: {
                type: "ORDER",
                orderId: order._id + "",
            },
            oneSignalPlayerIds: oneSignalsAdmin.map((e) => e.oneSignalId),
            pathUrl: "/dashboard/orders",
        });
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get logged in user  Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id,
    }).sort({ createdAt: "desc" });

    res.status(200).json({
        success: true,
        orders,
    });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find().sort({ createdAt: "desc" });

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(
            new ErrorHander("You have already delivered this order", 400)
        );
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({
        validateBeforeSave: false,
    });
    res.status(200).json({
        success: true,
    });

    let title = "",
        body = "";
    const storeName = "Shop";

    switch (req.body.status) {
        case "PENDING":
            title = `${storeName} đã tiếp nhận đơn hàng`;
            body = `Đơn hàng #${order._id} đã được ${storeName} tiếp nhận.`;
            break;
        case "CONFIRMED":
            title = `${storeName} xác nhận đơn hàng`;
            body = `Đơn hàng #${order._id} đã được ${storeName} xác nhận.`;
            break;

        case "PROCESSING":
            title = "Đơn của bạn đang được xử lý";
            body = `Đơn hàng #${order._id} đang được ${storeName} xử lý.`;
            break;

        case "DELIVERING":
            title = "Đơn của bạn đang được giao";
            body = `Đơn hàng #${order._id} của Quý Khách Hàng đã được bàn giao cho đơn vị vận chuyển.`;
            break;

        case "COMPLETED":
            title = "Đơn hàng đã được giao";
            body = `Đơn hàng #${order._id} của Quý Khách Hàng đã giao hoàn tất. ${storeName} xin tiếp nhận mọi đóng góp, khiếu nại qua Hotline và khẩn trương xác minh, phản hồi đến Quý Khách Hàng`;
            break;

        case "CANCEL":
            title = "Đơn hàng đã được hủy";
            body = `Đơn hàng #${order._id} của Quý Khách Hàng vừa bị hủy.`;
            break;
    }

    const oneSignal = await OneSignal.findOne({
        user: order.user._id.toString(),
    }).populate(["user"]);

    const data = {
        orderId: order.id + "",
        type: "order",
    };

    const notification = {
        title: title,
        content: body,
        shortContent: body,
        mode: `private`,
        user: order.user._id,
        order: order._id,
        from: "admin",
        type: "order",
        mode: "private",
        lastSendAt: moment().unix(),
    };

    const notificationSave = await Notification.create(notification);

    if (oneSignal) {
        await OneSignalUtil.pushNotification({
            heading: title,
            content: body,
            data,
            oneSignalPlayerIds: [oneSignal.oneSignalId],
        });
        notificationSave.lastSendAt = moment().unix();
        await notificationSave.save();
    }
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;
    product.sold = quantity;

    await product.save({
        validateBeforeSave: false,
    });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});

exports.deleteManyOrder = catchAsyncError(async (req, res, next) => {
    const orderId = req.body.id;
    if (orderId) {
        await Order.deleteMany({
            _id: {
                $in: orderId,
            },
        });
    }
    return res.status(200).json({
        success: true,
    });
});

exports.groupOrders = catchAsyncError(async (req, res, next) => {
    await Order.aggregate(
        [
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json({
                    data: result,
                });
            }
        }
    );
});
