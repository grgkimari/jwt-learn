import express, { urlencoded } from "express";
import * as mongoose from "mongoose";
import { registerUser } from "./AuthMiddleware.js";



const connectToDB = async () => {
    const connectionString = `mongodb://127.0.0.1:27017/JwtLearn`
    await mongoose.connect(connectionString).then(() => console.log(`Successfully connected to DB.`))
}

connectToDB()

const app = express()

app.use(express.json())
app.use(urlencoded())
app.use((req, res, next) => {
    console.log(`---------------------------\nRequest method : ${req.method}\nRequest path : ${req.path}\n_____________________________`)
    next()
})

app.get('/', (req, res) => {
    res.send(`Welcome home.`)
})

app.post('/register', registerUser)

app.listen(3000,() => {
    console.log(`Listening on port 3000`)
})