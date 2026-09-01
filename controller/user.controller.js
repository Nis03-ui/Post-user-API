
const{
    createUser:createUserService,
    getAllUsers:getAllUsersService,
    getUser:getUserService,
    updateUser:updateUserService,
    deleteUser:deleteUserService
}=require("../service/user.service")
const { ApiError } = require("../utils/ApiError")
const asyncHandler=require("../utils/asyncHandler")
const { use } = require("react")

exports.createUser=asyncHandler(async(req,res)=>{
   

    const user=await createUserService(req.body)
    return res.status(201).json({
        success:true,
        message:"User created successfully",
        user:user
    })
})

exports.getAllUsers=asyncHandler(async(req,res)=>{
    const users=await getAllUsersService()
    return res.status(200).json({
        success:true,
        message:"Users retrieved successfully",
        users:users
    })
})
exports.getUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const user=await getUserService(Number(id))
     console.log("USER FROM SERVICE:", user);
    if(!user){
        throw new ApiError("User Not found",404)
    }
    return res.status(200).json({
        success:true,
        message:"user retrieved successfully",
        user:user
    })
})

exports.updateUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const data=req.body

    const updatedUser=await updateUserService(data,Number(id))
    return res.status(200).json({
        success:true,
        message:"user updated successfully",
        updatedUser:updatedUser
    })
})

exports.deleteUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const deletedUser=await deleteUserService(Number(id))
    return res.status(200).json({
        success:true,
        message:"User deleted successfully",
        deletedUser:deletedUser
    })
})