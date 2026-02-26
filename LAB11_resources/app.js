const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("./config/db");
const listItem = require("./model/listItem");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const Authen = require("./control/authen");
const UserDB = require("./model/userModel");

const options = mysql.config;
options.createDatabaseTable = true;
const sessionStore = new mysqlStore(options);

app.use(
  session({
    store: sessionStore, 
    secret: "jklfsodifjsktnwjasdp465dd",
    resave: true, 
    saveUninitialized: true, 
    cookie: {
      maxAge: 3600000, 
      sameSite: true, 
      httpOnly: true, 
      secure: false, 
    },
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", Authen.authentication,async function(req, res) {
    const itemName = req.body.newItem;
    const newItem = {
        name: itemName
    };

    try {
        await listItem.create(newItem);
        res.redirect("/todos");
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).send("Server Error");
    }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    await Authen.userLogin(req, res, username, password);
    res.redirect('/todos');
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/todos", Authen.authentication, async (req, res) => {
  await listItem.defineInitialItems();
  const items = await listItem.getTodoItemsName();
  const user = await UserDB.findById(req.session.userId);
console.log("User Info:", items);
  res.render('list', {
    listTitle: "Today",
    newListItems: items,
    user: user,
  });
});

app.post("/delete", async function(req, res) {
    const deleteItemId = req.body.checkbox; 
    console.log("Deleting Item ID:", deleteItemId);
    try {
        const result = await listItem.delete(deleteItemId);
        if (result) {
            console.log("Successfully deleted item.");
            res.redirect("/todos"); 
        }
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Server Error");
    }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out." });
    }
    res.redirect('/');
  });
});

app.listen("3000", () => {
  console.log("Server is running on Port 3000.");
});
