import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  shortUrl: { type: String },
});

export const Url = mongoose.model("url", projectSchema);
