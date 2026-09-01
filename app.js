
const express=require("express")
const app=express()
const errorHandler=require("./middleware/error.middleware")
const notFound=require("./middleware/notFound.middleware")
const userApi=require("./route/user.routes")
app.use(express.json())
app.use("/api/user",userApi)
app.use(notFound)
app.use(errorHandler)
module.exports=app