import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import {CustomUser, GoogleUser} from '../model/user.js'

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await CustomUser.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist!" });
        }
        const isCorrectPassword = bcrypt.compare(password, 
            existingUser.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id,
        }, process.env.SECRET_KEY, {expiresIn: '1h'})
        res.status(200).json({result: existingUser, token});    
    } catch(error) {
        res.status(500).json({ 
            message: "Sign In was unsuccessful. Please try again!"
        })
    }
}

export const googleSignIn = async (req, res) => {
    const { name, email, userId } = req.body;
    const user = new GoogleUser({email, name, userId});
    try {
        const existingUser = await GoogleUser.findOne({userId});
        if (existingUser) {
            return res.json({message: "User already exists."});
        }
        await user.save();
        res.status(200).json({message: 'User saved successfully.'});    
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
}

export const signUp = async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        password, 
        confirmPassword 
    } = req.body;
    try {
        const existingUser = await CustomUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User aleady exists!" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match!" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await CustomUser.create({
            email, 
            password: hashedPassword, 
            name: `${firstName} ${lastName}`,
        })
        const token = jwt.sign({
            email: result.email,
            id: result._id,
        }, process.env.SECRET_KEY, {expiresIn: '1h'})
        res.status(200).json({result, token});    
    } catch(error) {
        res.status(500).json({ 
            message: "Sign Up was unsuccessful. Please try again!"
        })
    }
}
