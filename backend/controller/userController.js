const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHander = require("../utils/errorHander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const userModel = require("../models/userModel");
var os = require("os");
//register user

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, password, email } = req.body;

    const user = await User.create({
        name,
        password,
        email,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);
});

//login facebook
exports.loginFacebook = catchAsyncError(async (req, res, next) => {
    const { facebookId, email, name, avatar } = req.body;
    const user = await User.findOne({ facebookId });
    if (user) {
        return sendToken(user, 200, res);
    }
    let avatarData = {
        url: avatar,
        public_id: "12123",
    };

    const newUser = await User.create({
        name,
        email,
        avatar: avatarData,
        facebookId,
    });

    await sendToken(newUser, 200, res);
});

//login User

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHander("Please enter password & email", 400));
    }

    const user = await User.findOne({
        email,
    }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

//log out user
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetPasswordUrl = `${process.env.HOST_NAME}account/resetpassword/${resetToken}`;

    const message = `<Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false,
        });

        return next(new ErrorHander(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if (!user) {
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

// update password

exports.updatePasswordUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new ErrorHander("Password does not password", 400));
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is not correct", 401));
    }

    if (req.body.confirmPassword !== req.body.newPassword) {
        return next(new ErrorHander("Password does not match", 401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// update profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        sex: req.body.sex,
        phone: req.body.phone,
    };

    const userOld = await User.findById(req.user.id);

    if (req.body.avatar != userOld.avatar.url) {
        const imageId = userOld.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

//get All user

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//get Single user
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHander(`Does not exist user with : ${req.params.id}`)
        );
    }
    res.status(200).json({
        success: true,
        user,
    });
});

//update userRole

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newDataRole = {
        role: req.body.role,
    };

    const { email } = req.body;
    const isUserEmail = await User.findOne({
        email,
    });

    if (!isUserEmail) {
        return next(
            new ErrorHander(`Does not exits user with email: ${req.body.email}`)
        );
    }

    const user = await User.findByIdAndUpdate(req.params.id, newDataRole, {
        new: true,
        useFindAndModify: false,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

//update user address
exports.updateUserAddress = catchAsyncError(async (req, res, next) => {
    const newDataAddress = req.body.address;

    // let user = await User.findById(req.user.id)

    // if (!user) {
    //   return next(new ErrorHander("Password does not password", 400));
    // }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            $push: {
                address: newDataAddress,
            },
        },
        {
            new: true,
            useFindAndModify: false,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        user,
    });
});

//delete an address
exports.DeleteUserAddress = catchAsyncError(async (req, res, next) => {
    const dataAddress = req.body.addressDel;

    // let user = await User.findById(req.user.id)

    // if (!user) {
    //   return next(new ErrorHander("Password does not password", 400));
    // }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            $pull: {
                address: dataAddress,
            },
        },
        {
            new: true,
            useFindAndModify: false,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        user,
    });
});

//delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(
                `User does not exist with Id: ${req.params.id}`,
                400
            )
        );
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});

exports.deleteManyUser = catchAsyncError(async (req, res, next) => {
    const userId = req.body.id;
    if (userId) {
        await User.deleteMany({
            _id: {
                $in: userId,
            },
        });
    }
    return res.status(200).json({
        success: true,
    });
});
