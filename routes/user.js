const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResult");

router.use(protect);
router.use(authorize("admin"));

const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require("../controller/user");

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").put(updateUser).get(getUser).delete(deleteUser);
module.exports = router;
