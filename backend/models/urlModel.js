import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { Auth } from "./authModel.js";

const projectSchema = new mongoose.Schema(
  {
    // user: {
    //   type: String,
    //   required: true,
    // },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: Auth,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },

    nano_id: { type: String, default: nanoid },

    click: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Url = mongoose.model("Url", projectSchema);
