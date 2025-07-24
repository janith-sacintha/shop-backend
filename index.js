import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()

const app = express();

app.use(bodyParser.json())

app.use(cors())

app.use(
  (req ,res ,next)=>{

    const value = req.header("Authorization")

    if(value != null){ 

      const token = value.replace("Bearer " , "")

      jwt.verify(
        token,

        process.env.JWT_SECRET,

        (err ,decoded)=>{
          if(decoded == null){
            res.status(403).json(
              {
                message : "Unauthorized"
              }
            )


          }else{
            req.user = decoded
            next()
          }
            
        }
      )
    }else{
      next()
    }
    
  }
)

const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString).then(
  () => {
    console.log("Database connected")
  }

).catch(
  () => {
    console.log("Failed to connet to the database") 
  }
)

app.use("/api/users" , userRouter)
app.use("/api/products", productRouter)


app.listen(5000 , ()=> { 
  console.log("your server is running on port 5000")
})


