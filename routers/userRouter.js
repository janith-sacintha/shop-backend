import express from "express"
import { createUser, userLogin } from "../controllers/userContrller.js"

const userRouter = express.Router()

userRouter.post("/" , createUser)
userRouter.post("/login" , userLogin)

export default userRouter