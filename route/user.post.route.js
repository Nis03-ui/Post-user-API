const express=require("express")
const router=express.Router()
const{
    getUserWithPost,
    getPostWithAuthor
}=require("../controller/user.post.controller")

router.get("/user/:id",getUserWithPost)
router.get("/post/:id",getPostWithAuthor)

module.exports=router