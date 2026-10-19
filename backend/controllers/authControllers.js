import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../models/authModel.js";

export const register = async (req, res) => {
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User is not present" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const payload = {
      email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRY_TIME,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.REFRESH_TIME,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const refresh = (req,res,next) => {
  console.log(req.headers.authorization);
}
