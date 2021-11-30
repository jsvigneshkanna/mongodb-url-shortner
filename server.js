import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { urls } from "./urlSchema.js";

dotenv.config();
const app = express();
app.listen(process.env.PORT || 5000, () => {
  console.log("server connected");
});

mongoose.connect(process.env.MONGO_URL);
const dbCon = mongoose.connection;
dbCon.on("open", () => {
  console.log("mongoose connected");
});

app.get("/", async (req, res) => {
  const Urls = await urls.create({ fullUrl: "abcde" });
  await Urls.save();
});
