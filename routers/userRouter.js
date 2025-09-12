import express from "express"
import { createUser, getUser, userLogin } from "../controllers/userContrller.js"

const userRouter = express.Router()

userRouter.post("/" , createUser)
userRouter.post("/login" , userLogin)
userRouter.get("/", getUser)

export default userRouter