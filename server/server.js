const express = require('express')
const dotenv = require('dotenv')
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const morgan = require("morgan");
const connectDB = require("./config/db");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts.js");

dotenv.config({path: './config/.env'})

require('./config/passport')(passport)

connectDB()

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI,
     }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
})