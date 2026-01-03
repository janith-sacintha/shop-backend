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

            //P00200 -- > 99,999
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
    const page = parseInt(req.params.page) || 1 ;
    const limit = parseInt(req.params.limit) || 10;

    if(req.user == null){
        res.status(403).json({message : "Please login first"})
        return;
    }

    try{
        if(req.user.role == "admin"){
            //pagination
            const orderCount = await Order.countDocuments();
            const totalPages = Math.ceil(orderCount/limit);

            const orders = await Order.find().skip(limit * (page-1)).limit(limit).sort({date : -1})
            res.json(
                {
                    orders : orders,
                    totalPages : totalPages
                }
            )
        } else {
            const orderCount = await Order.countDocuments({ email : req.user.email});
            const totalPages = Math.ceil(orderCount/limit);

            const orders = await Order.find({ email : req.user.email}).skip(limit * (page-1)).limit(limit).sort({date : -1})
            res.json(
                {
                    orders : orders,
                    totalPages : totalPages
                }
            )
        }
    }catch(error){
        console.error("Error fetching products", error)
        res.status(500).json({message : "Failed to fetch products"})
    }
}



export async function deleteOrder(req,res){
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "Access denied. Admin only"
            }
        )
        return
    }

    const orderId = req.params.orderId

    try{
        await Product.deleteOne(
            {
                orderId : orderId
            }
        )

        res.json({message : "order was deleted sucessfully"})
        
    }catch(error){
        console.error(`error deleting order : ${error}`)
        res.json({message : "couldn't delete the order"})

    }
}


export async function updateOrderStatus(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Access denied. Admin only"})
        return;
    }

    try{
        const status = req.body.status
        const notes = req.body.notes

        const updatedOrder = await Order.findOneAndUpdate(
            {orderId: req.params.orderId},
            {status : status , notes : notes},
            {new: true}
        )

        res.json({message : "Successfully updated the order",
            order : updatedOrder
        })

    }catch(error){
        console.error(`error updating order : ${error}`)
        res.json({message : "couldn't update the order"})
    }
}


export const getOrderById = async (req, res) => {
  try {
    const email = req.user.email
    const orderId  = req.params.orderId

    const order = await Order.findOne({orderId})

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch order details" })
  }
}



