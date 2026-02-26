const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("list", 
  { listTitle: "Today", newListItems: [] });
});


app.listen("3000", () => {
  console.log("Server is running on Port 3000.");
});
