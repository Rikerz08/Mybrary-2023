if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

// set view engine
app.set("view engine", "ejs");
// set where our views will be coming from
app.set("views", __dirname + "/views");
// set up express layouts
// layouts are like set headers, footers, and html to
// avoid duplicating them across multiply view files
app.set("layout", "layouts/layout");
app.use(expressLayouts);
// public files: styles, javascripts, imgs
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("Connected to Mongoose");
});

// setting of default router
indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
