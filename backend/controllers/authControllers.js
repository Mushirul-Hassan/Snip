import bcrypt from "bcrypt";
import { Auth } from "../models/authModel.js";

export const createAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(404)
        .json({ success: false, message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoc = new Auth({
      // name,
      email,
      password: hashedPassword,
    });

    const savedDoc = await newDoc.save();
    console.log(savedDoc);
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAccount = async (req, res) => {
  const { email, password } = req.body;
  
};
