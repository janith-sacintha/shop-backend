import express from "express"
import { createUser, getAllUsers, getUser, googleLogin, resetPassword, sendOTP, setUserBlocked, userLogin } from "../controllers/userContrller.js"

const userRouter = express.Router()

userRouter.post("/register" , createUser)
userRouter.post("/login" , userLogin)
userRouter.get("/", getUser)
userRouter.post("/google-login",googleLogin)
userRouter.post("/send-otp", sendOTP)
userRouter.post("/reset-password", resetPassword)

userRouter.get("/all",getAllUsers)
userRouter.put("/block/:id",setUserBlocked)

export default userRouter