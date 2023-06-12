const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePasswordUser,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    updateUserAddress,
    DeleteUserAddress,
    deleteManyUser,
    loginFacebook,
} = require("../controller/userController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/login/facebook").post(loginFacebook);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePasswordUser);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me/update/address").post(isAuthenticatedUser, updateUserAddress);
router.route("/me/delete/address").post(isAuthenticatedUser, DeleteUserAddress);
router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router
    .route("/admin/muitiple/user")
    .post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyUser);
module.exports = router;
