const express = require("express");

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
} = require("../controller/post.controller");


const router = express.Router();

router.post("/",createPost)
router.get("/",getAllPosts)
router.get("/:id",getPost)
router.patch("/:id",updatePost)
router.delete("/:id",deletePost)


module.exports=router