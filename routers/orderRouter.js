import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const orderRouter = express.Router()

orderRouter.post("/" , createOrder)
orderRouter.get("/" ,getOrders)
orderRouter.get("/:orderId", getOrderById)
orderRouter.delete("/:orderId", deleteOrder)
orderRouter.put("/:orderId", updateOrderStatus)

export default orderRouter;