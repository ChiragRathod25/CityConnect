import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());




app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
});
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
}); 


import userRoutes from "./routes/user.routes.js";
import businessRoutes from "./routes/business.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/business", businessRoutes);

app.use(errorHandler);
export { app };