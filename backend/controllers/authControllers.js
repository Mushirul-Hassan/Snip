import bcrypt from "bcrypt";
import { Auth } from "../models/authModel.js";

export const createAccount = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(name);
  console.log(email);
  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const newDoc = new Auth({
    // name,
    email,
    password: hashedPassword,
  });
  console.log(newDoc);

  const savedDoc = await newDoc.save();
  console.log(savedDoc);
  res
    .status(201)
    .json({ success: true, message: "User registered successfully!"});
};
