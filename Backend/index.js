import { app } from "./app.js";
import ConnectDB from "./db/connectDB.js";
import "dotenv/config.js";

ConnectDB()
  .then(() => {
    try {
      app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log("Server is listening", process.env.PORT);
      });
    } catch (error) {
      console.log(`Error while starting the server : `, error);
    }
  })
  .catch((err) => {
    console.log(`MongoDB connection failed !! \n Error: ${err}`);
  });
