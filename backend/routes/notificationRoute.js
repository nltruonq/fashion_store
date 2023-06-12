const express = require("express");
const {
    createNotification,
    getAllNotificationAdmin,
    deleteManyNotification,
    deleteNotification,
    updateNotification,
    getNotificationDetail,
    getAllNotificationUser,
    pushNotificationToUser,
    pushNotificationToAllUser,
    summaryNotifications,
} = require("../controller/notificationController");
const { isAuthenticatedUser } = require("../middleware/auth");

const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router
    .route("/admin/notifications")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllNotificationAdmin);
router.route("/notifications").get(isAuthenticatedUser, getAllNotificationUser);
router
    .route("/summary/notifications")
    .get(isAuthenticatedUser, summaryNotifications);

router
    .route("/push/user")
    .post(isAuthenticatedUser, authorizeRoles("admin"), pushNotificationToUser);

router
    .route("/push/user/all")
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        pushNotificationToAllUser
    );

router.route("/notification/:id").get(getNotificationDetail);
router
    .route("/admin/notification/new")
    .post(isAuthenticatedUser, createNotification);
router
    .route("/admin/notification/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteNotification)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateNotification);
router
    .route("/admin/muitiple/notification")
    .post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyNotification);

module.exports = router;
