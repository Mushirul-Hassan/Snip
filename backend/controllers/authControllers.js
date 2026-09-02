import {bcrypt} from bcrypt;
import {User} from "../models/authModel.js";

export const createAccount = async (req,res) => {
    const hashedPassword = bcrypt.hash(password,10);
}

