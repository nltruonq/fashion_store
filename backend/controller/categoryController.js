const Category = require("../models/categoryModel");
const OneSignal = require("../models/oneSignalModel");
const moment = require("moment");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const OneSignalUtil = require("../utils/onesignal");

exports.createCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        category,
    });
});

exports.getOneCategory = catchAsyncError(async (req, res, next) => {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    res.status(201).json({
        success: true,
        category,
    });
});

exports.updateCategory = catchAsyncError(async (req, res, next) => {
    const categoryId = req.params.id;

    await Category.findByIdAndUpdate(categoryId, req.body);

    res.status(201).json({
        success: true,
    });
});

exports.deleteCategory = catchAsyncError(async (req, res, next) => {
    const categoryId = req.params.id;

    await Category.findByIdAndUpdate(categoryId, { isDeleted: true });

    res.status(201).json({
        success: true,
    });
});

exports.getAllCategories = catchAsyncError(async (req, res, next) => {
    const categories = await Category.find({ isDeleted: false });

    return res.status(200).json({
        success: true,
        categories,
    });
});
