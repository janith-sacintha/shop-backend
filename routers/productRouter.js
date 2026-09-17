import express from "express"
import { createProduct, deleteProduct, getProductInfo, getProducts, searchProducts, updateProduct } from "../controllers/productController.js"

const productRouter = express.Router()

productRouter.post("/",createProduct)
productRouter.get("/:page/:limit" , getProducts)
//productRouter.get("/search/:keyword" , getFilteredProducts)
productRouter.get("/:productId", getProductInfo)
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:keyword/:page/:limit" ,searchProducts)

export default productRouter;