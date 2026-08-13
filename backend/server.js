import express from "express";
import session from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import urlRouter from "./routes/urlRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  }),
);
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/url", urlRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
