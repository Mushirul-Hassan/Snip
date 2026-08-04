import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  // user: {
  //   type: String,
  //   required: true,
  // },

  url: {
    type: String,
    required: true,
  },

  nano_id: { type: String, default: nano.id },
});

export const Url = mongoose.model("url", projectSchema);
