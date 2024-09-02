import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"

dotenv.config({})

const app = express()


//middlware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const corsOptions = {
    origin: 'http//localhost',
    credentials: true
}

app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000


//api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute )

// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"

app.listen(PORT, () => {
    connectDB()
    console.log(`server running on port ${PORT}`);
})




// app.get("/home", (req, res) => {
//     return res.status(200).json({
//         message: "I am from backend",
//         success: true
//     })
// })