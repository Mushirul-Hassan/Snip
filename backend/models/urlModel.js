import mongoose from "mongoose";
import { nanoid } from 'nanoid'

const projectSchema = new mongoose.Schema({
  // user: {
  //   type: String,
  //   required: true,
  // },

  url: {
    type: String,
    required: true,
  },

  nano_id: { type: String, default: nanoid },
});

export const Url = mongoose.model("Url", projectSchema);
