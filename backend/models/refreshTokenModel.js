import mongoose from "mongoose";
import { Auth } from "./authModel";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: Auth,
    },
    token: {
        
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Token = mongoose.model("Token", refreshTokenSchema);
