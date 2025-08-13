import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userContrller.js";

export async function createOrder(req,res){
        try{
            let orderId = "CBC00200"

            if(req.user == null){
                res.status(403).json({message : "Please login first"})
                return;
            }

            //CBC00200 -- > 99,999
            const latestOrder = await Order.find().sort({date : -1}).limit(1)
            if(latestOrder.length > 0){
                const lastOrderIdInString = latestOrder[0].orderId
                const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("CBC","")
                const lastOderIdInInteger = parseInt(lastOrderIdWithoutPrefix)
                const newOderIdInInteger = lastOderIdInInteger+1    //201
                const newOrderIdWithoutPrefix = newOderIdInInteger.toString().padStart(5,'0')   //00201
                orderId = "CBC"+newOrderIdWithoutPrefix;     //CBC00201

            }

            const items = []
            let total = 0
            
            if(req.body.items !== null && Array.isArray(req.body.items)){

                for(let i=0 ; i< req.body.items.length ; i++){
                    let item = req.body.items[i]

                    let product = await Product.findOne({
                        productId : item.productId
                    })

                    if(product == null){
                        res.status(400).json({message : "invalid product ID"})
                        return;
                    }

                    items[i] = {
                        productId : product.productId,
                        name : product.name,
                        image : product.images[0],
                        price : product.price,          // fetching data using productId
                        qty : item.qty                  // asigning the quantity using item
                    }

                    total += product.price*item.qty
                }
            }else{
                res.status(400).json({message : "Invalid items format"})
                return;
            }

            const order = new Order(
                {
                    orderId : orderId,
                    email : req.user.email,
                    name : req.user.firstName +"-"+ req.user.lastName,
                    address : req.body.address,
                    phone : req.body.phone,
                    items : items,
                    total: total
                }
            )

            const result = await order.save()
            res.json(
                {
                    message : "Order created successfully",
                    result : result
                }
            )
    }catch(error){
        console.log("Error fetching products",error)
        res.status(500).json({message :"Error fetching products",error})
    }
}


export async function getOrders(req,res){
    if(req.user == null){
        res.status(403).json({message : "Please login first"})
        return;
    }

    try{
        if(req.user.role == "admin"){
            const orders = await Order.find().sort({date : -1})
            res.json(orders)
        }else{
            const orders = await Order.find({email : req.user.email})
            res.json(orders)
        }

    }catch(error){
        console.error("Error fetching products", error)
        res.status(500).json({message : "Failed to fetch products"})
    }
}