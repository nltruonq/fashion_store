const express = require("express");
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getOneCategory,
} = require("../controller/categoryController");
const { isAuthenticatedUser } = require("../middleware/auth");

const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router
    .route("/admin/categories")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllCategories);

router.route("/categories").get(isAuthenticatedUser, getAllCategories);
router.route("/admin/category/:id").get(isAuthenticatedUser, getOneCategory);

router.route("/admin/category/new").post(isAuthenticatedUser, createCategory);
router
    .route("/admin/category/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateCategory);

module.exports = router;
