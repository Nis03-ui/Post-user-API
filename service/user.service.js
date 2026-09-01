const prisma = require("../config/db");

exports.createUser=async(data)=>{
    const user=await prisma.user.create({
       data
    })
    return user
}

exports.getAllUsers=async()=>{
    const users=await prisma.user.findMany()
    return users
}

exports.getUser=async(id)=>{
    const user=await prisma.user.findUnique({
        where:{
            id
        }
    })
    return user
}

exports.updateUser=async(data,id)=>{
    const updatedUser=await prisma.user.update({
        where:{
            id
        },
        data
    })
    return updatedUser
}

exports.deleteUser=async(id)=>{
    const deletedUser=await prisma.user.delete({
        where:{
            id
        }
    })
    return deletedUser
}