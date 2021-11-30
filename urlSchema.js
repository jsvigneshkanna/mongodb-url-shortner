import { url } from "inspector";
import mongoose from "mongoose";
import shortid from "shortid";

const urlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const urls = mongoose.model("urls", urlSchema);
