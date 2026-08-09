import express from "express";
import { connectDB } from "./config/db.js";
import  dotenv  from "dotenv";
// import urlContr

dotenv.config();
connectDB();
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
