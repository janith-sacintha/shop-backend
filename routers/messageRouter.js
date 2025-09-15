import express from 'express'
import { createMessage, getMessagesGrouped } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.post("/", createMessage)
messageRouter.get("/messages/grouped", getMessagesGrouped)

export default messageRouter;