import express from 'express'
import { sendEmail } from '../controllers/emailController.js'

const emailRouter = express.Router()

emailRouter.post("/", sendEmail)

export default emailRouter;