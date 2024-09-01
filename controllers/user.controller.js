import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//Register User
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Somthing is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

//Login User
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Somthing is missing",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //check role is correct or not
        if (role === user.role) {
            return res.status(400).json({
                message: "Account doesnt exist with current role",
                success: false
            })
        }
        const tokenDate = {
            userId: user._id
        }
        const token = await jwt.sign(tokenDate, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, samSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//Logout User
export const logout = async (res, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//Update Profile User
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file
        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Somthing is missing",
                success: false
            })
        }

        //cloudinary ayega idhar
        const skillsArray = skills.split(",")
        const userId = req.id //middleware authentication
        let user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                message: "user Not found",
                success: false
            })
        }

        //updating data
        user.fullname = fullname,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.profile.bio = bio,
            user.profile.skills = skillsArray


        //resume comes here

        await user.save()
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true
        })

    } catch (error) {

    }
}