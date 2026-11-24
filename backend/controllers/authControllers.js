import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { Auth } from "../models/authModel.js";
import { Token } from "../models/refreshTokenModel.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const duplicate = await Auth.findOne({ email });
    if (duplicate) {
      return res
        .status(409)
        .json({ uccess: false, message: "User is already registered" });
    }

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

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const user = await Auth.findOne({ email });
    // const stringId = user._id.toString()
    // console.log(stringId);
    console.log(user.id);
    console.log("before bcrypt");
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
    console.log("before token");
    // const stringId = user._id.toString();
    // console.log(stringId);
    const payload = {
      sub: user.id,
    };
    console.log(payload);

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRY_TIME,
    });

    const jti = crypto.randomBytes(16).toString("hex");
    const refreshPayload = {
      sub: user.id,
      jti,
    };

    const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TIME,
    });
    // const tokenHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");
    console.log(user._id);
    console.log("before rf save");
    console.log(jti);
    const saveRefreshToken = new Token({
      user: user.id,
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
    console.log("before login success");
    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    console.log("refresh token", refreshToken);
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not present" });
    }

    console.log("after receiving refresh token");

    let decodeRToken;
    try {
      decodeRToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      console.log(decodeRToken.jti);
      console.log("this is refresh token in refresh logic", decodeRToken);
      // req.user = refreshToken;
      console.log(
        "getting user after getting refresh token back",
        decodeRToken.sub,
      );
      // if (!decodeRToken) {
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }

    const receivedJTI = decodeRToken.jti;
    console.log(receivedJTI);
    const findJTI = await Token.findOne({ jti: receivedJTI });
    console.log(findJTI);
    if (!findJTI) {
      console.log("not present means already deleted or rotated");
      return res
        .status(401)
        .json({ success: false, message: "Token is not present." });
    }

    // if (!findJTI) {
    //   return res.status(401).json({ message: "Refresh token not recognized" });
    // }
    // if (JTI.revoked) {
    //   return res.status(401).json({ message: "Refresh token revoked" });
    // }
    // if (findJTI.expiresAt < new Date()) {
    //   return res.status(401).json({ message: "Refresh token expired" });
    // }

    // THIS PART IS FOR LOGOUT
    // else {
    //   console.log("present so ,delete");
    //   await Token.findOneAndDelete({ _id: decodeRToken.sub });
    // }

    //find user
    // const user = await Token.findOne({sub: decodeRToken.sub});

    //compare jti of recieved token with db jti
    //but how would be 1. extract the received jti

    //and how would we 2.  know the db jti is for current one , i.e. current session one
    // if (received jti == stored (find jti ))
    // if found then then revoke the current token and then generate new
    //if not then say that it has already been revoked

    const payload = {
      sub: decodeRToken.sub,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRY_TIME,
    });

    const jti = crypto.randomBytes(16).toString("hex");
    const refreshPayload = {
      sub: decodeRToken.sub,
      jti,
    };

    const refreshToken_2 = jwt.sign(
      refreshPayload,
      process.env.REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_TIME,
      },
    );

    // const tokenHash = crypto
    //   .createHash("sha256")
    //   .update(refreshToken)
    //   .digest("hex");

    const newRefreshToken = new Token({
      // token: tokenHash,
      user: decodeRToken.sub,
      jti,
      // expiresAt,
      // revoked,
      // replacedBy,
    });

    await newRefreshToken.save();

    res.cookie("jwt", refreshToken_2, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      // maxAge: process.env.REFRESH_TIME,
    });

    res
      .status(200)
      .json({ message: "Refresh token rotation done", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    console.log(refreshToken);
    if (refreshToken) {
      // const decodeRToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const deleteToken = await Token.findOneAndDelete({
        id: refreshToken.sub,
      });
      console.log("deleted", deleteToken);
    }
    res.clearCookie("jwt", { path: "/api/auth/refresh" });
    res.json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
