
const path = require("path")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const publicDirectory = path.join(__dirname, "../Public")


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.static(publicDirectory))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


app.get("*name", (req, res) => {
    res.sendFile(path.join(publicDirectory, "index.html"))
})


module.exports = app