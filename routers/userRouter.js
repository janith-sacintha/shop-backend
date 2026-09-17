import express from "express"
import { createUser, getUser, googleLogin, userLogin } from "../controllers/userContrller.js"

const userRouter = express.Router()

userRouter.post("/" , createUser)
userRouter.post("/login" , userLogin)
userRouter.get("/", getUser)
userRouter.post("/google-login",googleLogin)

export default userRouter