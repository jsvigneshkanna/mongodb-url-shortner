import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ejs from "ejs";
import { urls } from "./urlSchema.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
app.listen(process.env.PORT || 5000, () => {
  console.log("server connected in site: http://localhost:5000");
});

// Template Views engine
app.set("view engine", ejs);
app.use(express.static(__dirname));

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
    res.status(200);
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
    res.status(200);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Something wrong 😟 check the logs!");
  }
});

// Accessing the shorturl from homepage
app.get("/:shorturl", async (req, res) => {
  try {
    const shorturl = req.params.shorturl;
    let { fullUrl, clicks } = await urls.findOne({ shortUrl: shorturl });
    console.log(clicks);
    const newClick = clicks + 1;
    const url = await urls.updateOne(
      {
        shortUrl: shorturl,
      },
      { $set: { clicks: newClick } }
    );
    res.status(200);
    res.redirect(fullUrl);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Something wrong 😟 check the logs!");
  }
});

// Deleting a particaular url row from table (full-url & short-url)
app.post("/delete", async (req, res) => {
  try {
    const shorturl = req.body.shorturl;
    console.log(shorturl);
    const deleteRes = await urls.deleteOne({ shortUrl: shorturl });
    res.status(200);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Something wrong 😟 check the logs!");
  }
});
