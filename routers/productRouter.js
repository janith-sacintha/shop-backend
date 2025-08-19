import express from "express"
import { createProduct, deleteProduct, getFilteredProducts, getProductInfo, getProducts, updateProduct } from "../controllers/productController.js"

const productRouter = express.Router()

productRouter.post("/",createProduct)
productRouter.get("/" , getProducts)
productRouter.get("/search/:keyword" , getFilteredProducts)
productRouter.get("/:productId", getProductInfo)
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)

export default productRouter;