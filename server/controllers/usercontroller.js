import userModel from "../models/userModel.js";
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { comparePassword,hashPassword } from "../helpers/authHelper.js";

export const registerController = async (req,res)=>{
    try {
        const {fullname, email,phone,password, role}= req.body;
        if(!fullname){
            return res.send({message: 'name is required'})
        }
        if(!email){
            return res.send({message: 'email is required'})
        }
        if(!password || password.length<8){
            return res.send({message: 'password is required'})
        }
        if(!phone){
            return res.send({message: 'phone number is required'})
        }
        if(!role){
            return res.send({message: 'role is required'})
        }
        const existinguser = await userModel.findOne({email})
        if (existinguser){
            return res.status(400).send({
                message:"Already registered please login",
                success: false 
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = await userModel.create({
            fullname,
            email,
            phone,
            password:hashedPassword,
            role,
        })
        res.status(201).send({
            success:true,
            message:"user registered successfully",
            user,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'there was an error please try again',
            error
        })
    }
}

export const loginController = async(req,res)=>{
    try {
        const {email,password,role} = req.body
        if(!email||!password || !role){
            return res.status(400).send({
                message:'please enter all the crendentials',
                success:false
            })
        }
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).send({
                message:"user not found",
                success: false
            })
        }
        const ifPasswordMatch = await comparePassword(password,user.password)
        if (!ifPasswordMatch){
            return res.status(400).send({
                message:"incorrect password",
                success:false
            })
        }
        if(role !== user.role){
            return res.status(400).send({
                message:"please select the correct role",
                success: false
            }) 
        }
        const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'})
        .send({
            success:true,
            message:`welcome back ${user.fullname}`,
            user:{
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                
                role:user.role,
                profile:user.profile
            },token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'there was an error please try again',
            error
        })
    }
}
export const logoutController = async (req,res) =>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).send({
            message:"logged out succefully",
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'there was an error please try again',
            error
        })
    }
}
export const updateProfileController = async (req,res) => { //needs working for later
    try {
        const {fullname,email,password,phone,bio,skills} = req.body
        if(skills){

            const skillsArray = skills.split(',')
        }
        const user = await userModel.findById(req.user._id)
        if(password && password.length<8){
            return res.json({error: "password is required and it should be atleast 8 characters"})
        }
        const hashedPassword = password ? await hashPassword(password):undefined
        const updatedUser= await userModel.findByIdAndUpdate(req.user._id,{
            fullname: fullname || user.fullname,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            bio: bio || user.profile.bio,
            skillsArray: skills || user.profile.skills 

        },{new:true})
        res.status(200).send({
            success:true,
            message:"user deatils updated successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'there was an error in logging in',
            error
        })
    }
}