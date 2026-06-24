const express=require("express")
const cookieParser=require("cookie-parser")
const app=express()
const cors=require("cors")

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


const authRoutes=require("./routes/auth.route")
app.use("/api/auth",authRoutes)

module.exports=app