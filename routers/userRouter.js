import express from "express"
import { createUser, getUser, googleLogin, resetPassword, sendOTP, userLogin } from "../controllers/userContrller.js"

const userRouter = express.Router()

userRouter.post("/register" , createUser)
userRouter.post("/login" , userLogin)
userRouter.get("/", getUser)
userRouter.post("/google-login",googleLogin)
userRouter.post("/send-otp", sendOTP)
userRouter.post("/reset-password", resetPassword)

export default userRouter