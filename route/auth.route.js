const express=require("express")
const router=express.Router()

const{
    register,
    login,
    getMe
}=require("../controller/auth.controller")
const {createUserSchema}=require("../validation/validation")
const validate=require("../middleware/validation.middleware")
const authMiddleware=require("../middleware/auth.middleware")


router.post("/register",validate(createUserSchema),register)
router.post("/login",login)
router.get("/me", authMiddleware, getMe);

module.exports=router