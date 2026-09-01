const express = require("express");

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
} = require("../controller/post.controller");

const authMiddleware=require("../middleware/auth.middleware")
const router = express.Router();

router.post("/",createPost)
router.get("/",getAllPosts)
router.get("/:id",getPost)
router.patch("/:id",authMiddleware,updatePost)
router.delete("/:id",authMiddleware,deletePost)


module.exports=router