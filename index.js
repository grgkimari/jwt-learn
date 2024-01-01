import express, { urlencoded } from "express";
import * as mongoose from "mongoose";
import { authenticate, loginUser, registerUser, getProfileInfo } from "./AuthMiddleware.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


const connectToDB = async () => {
    const connectionString = `mongodb://127.0.0.1:27017/JwtLearn`
    await mongoose.connect(connectionString).then(() => console.log(`Successfully connected to DB.`))
}

connectToDB()

const app = express()

app.use(bodyParser({
    urlencoded : true
}))
app.use(cookieParser())
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
app.post('/login', loginUser)
app.get('/profile',authenticate, getProfileInfo)

app.listen(3000,() => {
    console.log(`Listening on port 3000`)
})