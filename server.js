import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ejs from "ejs";
import { urls } from "./urlSchema.js";

dotenv.config();
const app = express();
app.listen(process.env.PORT || 5000, () => {
  console.log("server connected in site: http://localhost:5000");
});

// Template Views engine
app.set("view engine", ejs);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongodb
mongoose.connect(process.env.MONGO_URL);
const dbCon = mongoose.connection;
dbCon.on("open", () => {
  console.log("mongoose connected");
});

// Home page rendering with values from mongodb
app.get("/", async (req, res) => {
  try {
    const Urls = await urls.find();
    res.render("index.ejs", { Urls: Urls });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Something wrong 😟 check the logs!");
  }
});

// Posting the fullurl to mongodb to store
app.post("/url", async (req, res) => {
  try {
    const { fullUrl: fullurl } = req.body;
    const url = await urls.create({
      fullUrl: fullurl,
    });
    await url.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// Accessing the shorturl from homepage
app.get("/:shorturl", async (req, res) => {
  try {
    const shorturl = req.params.shorturl;
    let { fullUrl, clicks } = await urls.findOne({ shortUrl: shorturl });
    console.log(fullUrl);
    res.redirect(fullUrl);
  } catch (error) {
    console.error(error);
  }
});
