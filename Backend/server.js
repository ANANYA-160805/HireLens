require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

async function startServer() {
    try {
        await connectToDB()

        const port = process.env.PORT || 3000
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.name,
            error.code || "UNKNOWN"
        )
        process.exitCode = 1
    }
}

startServer()