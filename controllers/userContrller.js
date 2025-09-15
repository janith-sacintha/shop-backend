import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser (req , res ) {

    const passwordHash = bcrypt.hashSync(req.body.password ,10)

    const user = new User(
        {
            firstName : req.body.firstName ,
            lastName : req.body.lastName ,
            email : req.body.email ,
            password : passwordHash
        }
    )

    user.save().then(
        ()=>
        {
            res.json(
                {
                    message : "user created successfully"
                }
            )
        }
    )

    .catch(
        ()=>
        {
            res.json(
                {
                    message : "failed to create user"
                }
            )
        }
    )
}


export function userLogin (req , res) {
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email : email

        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json(
                    {
                        message : "User not found"
                    }
                )

            }else{
                const isPasswordCorrect = bcrypt.compareSync(password, user.password)
                if(isPasswordCorrect){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isBlocked : user.isBlocked,
                            isEmailVerified : user.isEmailVerified,
                            image : user.image
                        },
                        process.env.JWT_SECRET
                    )

                    res.json(
                        {
                            token : token ,
                            message : "Login successful",
                            role : user.role
                        }
                    )
                }else{
                    res.status(403).json(
                        {
                            message : "Incorrect password"
                        }
                    )
                }
            }
        }
    )
}

export function getUser(req,res) {
    if(req.user == null){
        res.status(404).json(
            { message : "User not found"}
        )
    } else {
        res.json(
            { name : req.user.firstName+"-"+req.user.lastName ,
                email : req.user.email
            }
        )
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
}
