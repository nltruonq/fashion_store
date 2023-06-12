const express = require("express");
const { unSub, sub } = require("../controller/onsignalController");
const { isAuthenticatedUser } = require("../middleware/auth");

const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/oneSignal/sub").post(isAuthenticatedUser, sub);
router.route("/oneSignal/unSub").delete(isAuthenticatedUser, unSub);

module.exports = router;
