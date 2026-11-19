import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { Auth } from "../models/authModel.js";
import { Token } from "../models/refreshTokenModel.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

     if (!name) {
      return res
        .status(404)
        .json({ success: false, message: "Username is required" });
    }

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
      name,
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
    console.log("hello");;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User is not present" });
    }

    //  if (!email) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Email is invalid" });
    // }

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

    const jti = crypto.randomBytes(16).toString("hex");
    const refreshPayload = {
     email,
      jti,
    };

    const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TIME,
    });
    // const tokenHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");

    const saveRefreshToken = new Token({
      // token: tokenHash,
      userId : _id,
      jti,
    });

    const sRT = await saveRefreshToken.save();
    console.log(sRT);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      // maxAge: process.env.REFRESH_TIME,
    });
   console.log("hi");
    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const refresh = async (req, res) => {
  const refreshCookie = req.cookies.jwt;
  console.log("hi", refreshCookie);
  if (!refreshCookie) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not present" });
  }

  console.log("nehou");
  try {
    const refreshToken = jwt.verify(refreshCookie, process.env.REFRESH_SECRET);
    console.log(refreshToken.refreshPayload.jti);
    console.log("hello", refreshToken);
    // req.user = refreshToken;
    console.log("bye", req.user);
    // if (!refreshToken === refreshCookie)
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }



  const jti = crypto.randomBytes(16).toString("hex");

  try {
    const payload = {
      _id,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRY_TIME,
    });

    const jti = crypto.randomBytes(16).toString("hex");
    const refreshPayload = {
      _id,
      jti,
    };

    const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TIME,
    });

    // const tokenHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");

    const newRefreshToken = new Token({
      // token: tokenHash,
      jti,
      // expiresAt,
      // revoked,
      // replacedBy,
    });

    await newRefreshToken.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      // maxAge: process.env.REFRESH_TIME,
    });

    res.status(200).json({ message: "Access token sent again", accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
