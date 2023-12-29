import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from './Models/UserModel.js'
dotenv.configDotenv({
    path : '/.env'
})
export const registerUser = async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) //process.env.ACCESS_TOKEN_SECRET
    const newUser = new User({
        email : req.body.email,
        password : hashedPassword
    })
    await newUser.save().then(() => console.log(`User with email ${newUser.email} registered successfully.`)).catch((error) => console.log(`Error at user registration : ${error}`))
    res.status(201).send("User created successfully.")
}