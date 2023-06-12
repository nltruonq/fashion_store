const Notification = require("../models/notificationModel");
const OneSignal = require("../models/oneSignalModel");
const moment = require("moment");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const OneSignalUtil = require("../utils/onesignal");

exports.createNotification = catchAsyncError(async (req, res, next) => {
    const notification = await Notification.create({
        ...req.body,
        from: "admin",
        mode: "global",
    });

    res.status(201).json({
        success: true,
        notification,
    });
});

exports.getAllNotificationAdmin = catchAsyncError(async (req, res, next) => {
    const notifications = await Notification.find({
        isDeleted: false,
        mode: "global",
    })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });

    res.status(200).json({
        success: true,
        notifications,
        total: notifications.length,
    });
});

exports.getAllNotificationUser = catchAsyncError(async (req, res, next) => {
    let options = {};
    if (req.query.type === "admin") {
        options = { ...options, from: "admin", type: "normal" };
    } else if (req.query.type === "order") {
        options = {
            ...options,
            type: "order",
            from: "admin",
            user: req.user._id,
        };
    } else {
        options = {
            // ...options,
            $or: [
                { from: "admin", type: "normal" },
                { user: req.user._id, from: "admin" },
            ],
        };
    }
    const notifications = await Notification.find({
        isDeleted: false,
        lastSendAt: { $gt: 0 },
        ...options,
    })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });

    res.status(200).json({
        success: true,
        notifications,
        total: notifications.length,
    });
});

exports.summaryNotifications = catchAsyncError(async (req, res, next) => {
    const notificationAdmin = await Notification.find({
        isDeleted: false,
        lastSendAt: { $gt: 0 },
        $and: [{ mode: "global" }, { from: "admin", type: "normal" }],
    })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });

    const notificationOrder = await Notification.find({
        isDeleted: false,
        lastSendAt: { $gt: 0 },
        $and: [{ user: req.user._id }, { type: "order" }, { from: "admin" }],
    })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });

    res.status(200).json({
        success: true,
        admin: notificationAdmin.length,
        order: notificationOrder.length,
    });
});

exports.deleteNotification = catchAsyncError(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorHander("Notification not found", 404));
    }

    notification.isDeleted = true;

    await notification.save();

    return res.status(200).json({
        success: true,
    });
});

exports.deleteManyNotification = catchAsyncError(async (req, res, next) => {
    const notificationIds = req.body.id;
    if (notificationIds.length) {
        await Notification.deleteMany({
            _id: {
                $in: notificationIds,
            },
        });
    }
    const notifications = await Notification.find({ isDeleted: false })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });
    return res.status(200).json({
        success: true,
        notifications,
    });
});

exports.updateNotification = catchAsyncError(async (req, res, next) => {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorHander("Notification not found", 404));
    }

    notification = await Notification.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});

//get product detail
exports.getNotificationDetail = catchAsyncError(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id).populate([
        "user",
        "order",
    ]);

    if (!notification) {
        return next(new ErrorHander("Notification not found", 404));
    }

    res.status(200).json({
        success: true,
        notification,
    });
});

exports.pushNotificationToUser = catchAsyncError(async (req, res, next) => {
    const notificationId = await req.body.notificationId;

    const notification = await Notification.findOne({
        id: notificationId,
    }).populate(["user"]);

    const oneSignal = await OneSignal.findOne({
        user: notification.user._id.toString(),
    }).populate(["user"]);

    if (notification && oneSignal) {
        await OneSignalUtil.pushNotification({
            heading: notification.title,
            data: {},
            oneSignalPlayerIds: [oneSignal.oneSignalId],
        });
        notification.lastSendAt = moment().unix();
        await notification.save();
    }

    res.status(200).json({
        success: true,
        notification,
    });
});

exports.pushNotificationToAllUser = catchAsyncError(async (req, res, next) => {
    const notificationId = await req.body.notificationId;

    const notification = await Notification.findOne({
        id: notificationId,
    }).populate(["user"]);

    const oneSignal = await OneSignal.find({}).populate(["user"]);

    if (notification && oneSignal) {
        await OneSignalUtil.pushNotification({
            heading: notification.title,
            content: notification.content,
            data: {},
            oneSignalPlayerIds: oneSignal.map((item) => item.oneSignalId),
        });
        await Notification.findByIdAndUpdate(notificationId, {
            lastSendAt: moment().unix(),
        });
    }

    res.status(200).json({
        success: true,
        notification,
    });
});
