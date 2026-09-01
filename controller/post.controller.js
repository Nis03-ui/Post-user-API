const { success } = require("zod")
const{
    createPost:createPostService,
    getAllPosts:getAllPostsService,
    getPost:getPostService,
    updatePost:upadatePostService,
    deletePost:deletedPostService
}=require("../service/post.service")

const ApiError=require("../utils/ApiError")
const asyncHandler=require("../utils/asyncHandler")
const { tr, th } = require("zod/locales")


exports.createPost=asyncHandler(async(req,res)=>{
    const post=await createPostService(req.body)
    return res.status(201).json({
        success:true,
        message:"Post created successfully",
        post:post
    })
})

exports.getAllPosts=asyncHandler(async(req,res)=>{
    const posts=await getAllPostsService()
    return res.status(200).json({
        success:true,
        message:"Post retrieved successfully",
        posts:posts

    })
})

exports.getPost=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const post=await getPostService(Number(id))
    if(!post){
        throw new ApiError("Post noy found",404)
    }

    return res.status(200).json({
        success:true,
        message:"Post retrieved successfully",
        post:post
    })
})

exports.updatePost=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const data=req.body
    const upadatedPost=await upadatePostService(data,Number(id))
    if(!upadatedPost){
        throw new ApiError("Post Not found",404)
    }

    return res.status(200).json({
        success:true,
        message:"Post updated successfully",
        upadatedPost:upadatedPost
    })
})

exports.deletePost=asyncHandler(async(req,res)=>{
    const{id}=req.params
    const deletedPost=await deletedPostService(Number(id))

    if(!deletedPost){
        throw new ApiError("Post Not found",404)
    }

    return res.status(200).json({
        success:true,
        message:"Post deleted successfully",
        deletedPost:deletedPost
    })
})