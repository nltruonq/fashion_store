const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create({
        ...req.body,
        category: req.body.categoryId,
    });

    res.status(201).json({
        success: true,
        product,
    });
});

exports.getAllProduct = catchAsyncError(async (req, res, next) => {
    let resultPerPage = 5;
    if (req.query.resultPerPage) {
        resultPerPage = req.query.resultPerPage;
    }
    const productsCount = await Product.countDocuments();

    const apifeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let sort = req.query.sort;
    let sorter = {
        createdAt: -1,
    };
    if (sort == -1 || sort == 1) {
        sorter = {
            price: sort,
        };
    }
    if (sort == 5) {
        sorter = {
            ratings: -1,
        };
    }

    if (sort == "banchay") {
        sorter = {
            sold: -1,
        };
    }

    let products = await apifeature.query.sort(sorter);

    let filteredProductsCount = products.length;

    apifeature.pagination(resultPerPage);

    products = await apifeature.query
        .sort(sorter)
        .populate(["category"])
        .clone();

    if (!products) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove(product);

    return res.status(200).json({
        success: true,
        product,
    });
});

exports.deleteManyProduct = catchAsyncError(async (req, res, next) => {
    const productId = req.body.id;
    if (productId) {
        await Product.deleteMany({
            _id: {
                $in: productId,
            },
        });
    }
    const products = await Product.find();
    return res.status(200).json({
        success: true,
        products,
    });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    if (req.body.images?.length && req.body.isChangeImage) {
        // Images Start Here
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        if (images !== undefined) {
            // Deleting Images From Cloudinary
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(
                    product.images[i].public_id
                );
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            req.body.images = imagesLinks;
        }
    }

    let newData = req.body;
    if (req.body.categoryId) {
        newData = { ...newData, category: req.body.categoryId };
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        product,
    });
});

//get product detail
exports.getProductDetail = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    const products = await Product.find().populate(["category"]);

    res.status(200).json({
        success: true,
        product,
        products,
    });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),
                    (rev.comment = comment),
                    (rev.name = req.user.name);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({
        validateBeforeSave: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                rev.name = req.user.name;
        });
    }
    await product.save({
        validateBeforeSave: false,
        new: true,
    });

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
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
