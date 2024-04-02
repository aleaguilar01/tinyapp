/**
 * Backend endpoint colecction for TinyApp.
 * @author Alejandra Aguilar
 */

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

//configuration for view engine as ejs
app.set("view engine", "ejs");

// encoding for urls
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

/**
 * Function to generate a random string thar will be use as a unique identifier for tinyurls
 * @param {number} lenghtOfId
 * @returns {string}
 */
const generateRandomString = (lenghtOfId) => {
  let randomString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let n = 0; n < lenghtOfId; n++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 * Endpoint to create tiny urls and save them in memory database
 */
app.post("/urls", (req, res) => {
  const uuid = generateRandomString(6);
  urlDatabase[uuid] = req.body.longURL;
  res.redirect(`/urls/${uuid}`);
});

/**
 * Endpoint to delete urls from database.
 */
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

/**
 * Endpoint to update urls on database.
 */
app.post(`/urls/:id`, (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.updatedURL;
  res.redirect("/urls");
});

/**
 * Endpoint to login user.
 */
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

/**
 * Endpoint to logout user.
 */
app.post("/logout", (req, res) => {
  //res.cookie('username', null,{ expires: Date.now()});
  res.clearCookie("username");
  res.redirect("/urls");
});

/**
 * Endpoint to fetch all urls saved in the database
 */
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase};
  if (req.cookies["username"]) {
    templateVars["username"] = req.cookies["username"];
  }
  res.render("urls_index", templateVars);
});

/**
 * Endpoint to fetch the form to submit a long URL.
 */
app.get("/urls/new", (req, res) => {
  const templateVars = {};
  if (req.cookies["username"]) {
    templateVars["username"] = req.cookies["username"];
  }
  res.render("urls_new", templateVars);
});

/**
 * Endpoint to fetch one url saved in the database
 * @param id refers to the short url id.
 * @returns Individual Url Page.
 */
app.get(`/urls/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  if (req.cookies["username"]) {
    templateVars["username"] = req.cookies["username"];
  }
  res.render("urls_show.ejs", templateVars);
});

/**
 * Endpoint to redirect to long URL.
 */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = {};
  if (req.cookies["username"]) {
    templateVars["username"] = req.cookies["username"];
  }
  res.redirect(longURL);
});

/**
 * Endpoint to fetch the registration page
 */
app.get("/register", (req, res) => {
  res.render("register.ejs");
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
