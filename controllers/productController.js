import Product from "../models/product.js";
import { isAdmin } from "./userContrller.js";

export async function createProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admin only"
            }
        )
        return
    }

    const product = new Product(req.body)

    try{
        const response = await product.save()

        res.json(
            {
                message : "Product created successfully",
                product : response
            }
        )

    }catch(error){
        console.log(error)
        res.status(500).json(
            {
                message : "Failed to save product "
            }
        ) 
    }
}


export async function getProducts(req,res){
    const page = parseInt(req.params.page) || 1 ;
    const limit = parseInt(req.params.limit) || 10;

    try{
        if(isAdmin(req)){
            const orderCount = await Product.countDocuments();
            const totalPages = Math.ceil(orderCount/limit);

            const products = await Product.find().skip(limit * (page - 1)).limit(limit)
            res.json(
                {
                    products : products,
                    totalPages : totalPages
                }
            )
            return 

        }else{
            const orderCount = await Product.countDocuments({isAvailable: true});
            const totalPages = Math.ceil(orderCount/limit);

            const products = await Product.find({isAvailable: true}).skip(limit * (page-1)).limit(limit)
            res.json(
                {
                    products : products,
                    totalPages : totalPages
                }
            )
            return 
        }

    }catch(error){
            res.status(500).json(
                {
                    message : "fetching products unsuccessful"
                }
            )
    }
    
}

export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admin only"
            }
        )
        return
    }

    const productId = req.params.productId

    try{
        await Product.deleteOne(
            {
                productId : productId
            }
        )

        res.json({message : "Product was deleted sucessfully"})
        
    }catch(error){
        console.error(`error deleting product : ${error}`)
        res.json({message : "couldn't delete the product"})

    }
}

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Access denied. Admin only"})
        return;
    }

    const data = req.body
    const productId = req.params.productId
    data.productId = productId


    try{
        await Product.updateOne(
            {
                productId : productId
            },
            data
        )

        res.json({message : "Successfully updated the product"})

    }catch(error){
        console.error(`error updating product : ${error}`)
        res.json({message : "couldn't update the product"})
    }
}

export async function getProductInfo(req,res){
    
    try{
        const productId = req.params.productId
        const product = await Product.findOne({productId : productId})

        if(product == null){
            res.status(403).json({message : "Product not found"})

        }else{
            if(isAdmin(req)){
                res.json(product)
                return
            
            }else{
                if(product.isAvailable){
                    res.json(product)
                }else{
                    res.status(404).json({message : "Product not available"})
                }
            }
        }
        
        
    }catch(error){
        res.status(500).json({message : "Product info fetching failed"})
        return
    }
}

/*
export async function getFilteredProducts(req, res) {
    const keyword = req.params.keyword
        ? { name: { $regex: req.params.keyword, $options: "i" } } // ✅ fixed
        : {};

    try {
        if(isAdmin(req)){
            const products = await Product.find({ ...keyword })
            res.json(products)
            return 

        }else{
            let query = { isAvailable: true }; // always filter available products
            
            const products = await Product.find({ ...query , ...keyword })
            res.json(products)
            return 
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
*/

