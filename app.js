// app.js
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

// const upload = require('./routers/multer');    

const session = require('express-session');
const mongoose = require("mongoose");
const path = require("path");

const router = require("./router"); // import router

const app = express();
const port = process.env.PORT || 3000;

// const staticFiles = "C:\\Users\\DELL\\Desktop\\Webdash\\public";

// --- Session setup ---
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // optional if you accept JSON
// app.use(express.static(staticFiles));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// --- View engine setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// --- Use router ---
app.use("/", router);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
