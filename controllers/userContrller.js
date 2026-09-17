import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

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
                            id : user._id,
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
            { name : req.user ,
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

export async function googleLogin(req, res) {
    const googleToken = req.body.token;

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googleToken}`
            }
        });

        const googleUser = response.data;
        let user = await User.findOne({ email: googleUser.email });

        if (user == null) {
            user = new User({
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                email: googleUser.email,
                role: "user",
                isEmailVerified: true,
                password: "123"
            });
            await user.save();
        }

        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET
        );

        res.json({
            token: token,
            message: "Google login successful",
            role: user.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch user info from Google"
        });
    }
}