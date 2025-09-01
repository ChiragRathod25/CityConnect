import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
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


import authRoutes from "./routes/auth.js";

app.use("/api/v1/auth", authRoutes);


export { app };