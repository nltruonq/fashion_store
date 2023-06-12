const OneSignal = require("../models/oneSignalModel");

const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.sub = catchAsyncError(async (req, res, next) => {
    const oldOneSignal = await OneSignal.findOne({
        oneSignalId: req.body.oneSignalId,
    });

    if (oldOneSignal || !req.body.oneSignalId) {
        return res.status(201).json({
            success: true,
        });
    }

    const data = {
        oneSignalId: req.body.oneSignalId,
        user: req.user._id,
    };

    const onesignal = await OneSignal.create(data);

    res.status(201).json({
        success: true,
    });
});

exports.unSub = catchAsyncError(async (req, res, next) => {
    const oldOneSignal = await OneSignal.findOne({
        oneSignalId: req.body.oneSignalId,
    });

    if (oldOneSignal) {
        await oldOneSignal.remove(oldOneSignal);
    }

    res.status(201).json({
        success: true,
    });
});
