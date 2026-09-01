const express = require("express");

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../controller/user.controller");

const { createUserSchema } = require("../validation/validation");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;