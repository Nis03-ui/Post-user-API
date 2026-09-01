
const{
    getUserWithPost:getUserWithPostService,
    getPostWithAuthor:getPostWithAuthorService,
   

}=require("../service/user.post.service")
const { ApiError } = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")

exports.getUserWithPost=asyncHandler(async(req,res)=>{
    const{id}=req.params
    const user=await getUserWithPostService(Number(id))
    if(!user){
        throw new ApiError(404,"User not found")
    }
    return res.status(200).json({
        success:true,
        message:"User with their post sucessfully retrieved",
        user:user
    })
})

exports.getPostWithAuthor=asyncHandler(async(req,res)=>{
    const{id}=req.params
    const post=await getPostWithAuthorService(Number(id))
    if(!post){
        throw new ApiError(404,"Post not found")
    }
    return res.status(200).json({
        success:true,
        message:"Post with their author sucessfully retrieved",
        post:post
    })

})