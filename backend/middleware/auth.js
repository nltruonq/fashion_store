const jwt = require("jsonwebtoken");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return next(
            new ErrorHander("Please Login to access this resource", 401)
        );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});
// exports.protect = catchAsyncError(async (req, res, next) => {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return next(new ErrorResponse("Not authorized to access this route", 401));
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       const user = await User.findById(decoded.id);

//       if (!user) {
//         return next(new ErrorResponse("No user found with this id", 404));
//       }

//       req.user = user;

//       next();
//     } catch (err) {
//       return next(new ErrorResponse("Not authorized to access this router", 401));
//     }
//   })

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};
