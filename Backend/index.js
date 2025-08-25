import ConnectDB from "./db/connectDB.js"
import { app } from "./app.js"
const PORT=process.env.PORT || 5000

ConnectDB().then(()=>{
   try {
     app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
   } catch (error) {
        console.error("Failed to start the server",error)
   }
}).catch((error)=>{
    console.error("Failed to connect to the database",error)
})  