const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("./config/db");
const listItem = require("./model/listItem");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const Authen = require("./control/authen");
const UserDB = require("./model/userModel");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async(req, res) => {
  listItem.defineInitialItems();
  const items = await listItem.getTodoItemsName();
  res.render("list", 
  { listTitle: "Today", newListItems: items });
});

app.post("/", async function(req, res) {
    const itemName = req.body.newItem;
    const newItem = {
        name: itemName
    };

    try {
        await listItem.create(newItem);
        res.redirect("/");
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).send("Server Error");
    }
});

app.post("/delete", async function(req, res) {
    const deleteItemId = req.body.checkbox; 
    console.log("Deleting Item ID:", deleteItemId);
    try {
        const result = await listItem.delete(deleteItemId);
        if (result) {
            console.log("Successfully deleted item.");
            res.redirect("/"); 
        }
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Server Error");
    }
});

app.listen("3000", () => {
  console.log("Server is running on Port 3000.");
});
