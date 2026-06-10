const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

async function registerUser(req,res){
    const {username,email,password}=req.body

    const isAlreadyRegistered=await userModel.findOne({$or:[{username:username},{email:email}]})

    if(isAlreadyRegistered){
        return res.status(400).json({
            message:"User with the same username or email already exists"

        })
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hash
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)

    return res.status(201).json({
        message:"User registered successfully",
        user:{
            username:user.username,
            email:user.email,
        }
    })

}

async function loginUser(req,res){
    const {username,email,password}=req.body

    const user=await userModel.findOne({$or:[{username:username},{email:email}]})

    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        res.status(400).json({
            message:"invalid credentials"
        })
    }
    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)

    return res.status(201).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email,
        }
    })
}

module.exports={registerUser,loginUser}