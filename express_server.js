/**
 * Backend endpoint colecction for TinyApp.
 * @author Alejandra Aguilar
 */

/**
 * Dependencies
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const e = require("express");

/**
 * Express initialization
 */
const app = express();
const PORT = 8080; // default port 8080

//configuration for view engine as ejs
app.set("view engine", "ejs");

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true })); // encoding for urls
app.use(cookieParser());

/**
 * urls and tinyurls database
 */
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
/**
 * users database
 */
const users = {
  "user@example.com": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  "user2@example.com": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////////////////////// HELPERS ///////////////////////////////////////////////

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

/**
 * Function to check if an user exists into the database.
 * NOTE: THIS FUNCTION REQUIRED TO LOOK FOR EACH USER BY IT´S ID,
 * BUT I THOUGHT THAT IF WE STORED THE USER WITH THE EMAIL INSTEAD OF THE ID,
 * WE WOULDN'T HAVE TO LOOP THROUGH THE OBJECT, JUST LOOK FOR THE KEY.
 * @param {string} email
 * @param {object} database
 * @returns {object}
 */

const getUserByEmail = (email, database) => {
  if (database[email]) {
    return database[email];
  } else return null;
};

/////////////////////////////////// ENDPOINTS ///////////////////////////////////////////////

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
  res.clearCookie("user_id");
  res.redirect("/urls");
});

/**
 * Endpoint to update the users database.
 */
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userAlreadyOnDatabase = getUserByEmail(email, users);
  if (userAlreadyOnDatabase || !email || !password) {
    const templateVars = {userAlreadyOnDatabase, email, password};
    console.log(templateVars);
    res.status(400).render("status400.ejs", templateVars);
  } else {
    const userId = generateRandomString(6);
    users[email] = {
      id: userId,
      email,
      password: req.body.password
    };
    res.cookie('user_id', email);
    res.redirect(`/urls`);
  }
});

/**
 * Endpoint to fetch all urls saved in the database
 */
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  if (req.cookies["user_id"]) {
    const userID = req.cookies["user_id"];
    const user = users[userID];
    if (user) {
      templateVars.user = user;
    }
  }
  res.render("urls_index", templateVars);
});

/**
 * Endpoint to fetch the form to submit a long URL.
 */
app.get("/urls/new", (req, res) => {
  const templateVars = {};
  if (req.cookies["user_id"]) {
    const userID = req.cookies["user_id"];
    const user = users[userID];
    if (user) {
      templateVars.user = user;
    }
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
  if (req.cookies["user_id"]) {
    const userID = req.cookies["user_id"];
    const user = users[userID];
    if (user) {
      templateVars.user = user;
    }
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
  if (req.cookies["user_id"]) {
    const userID = req.cookies["user_id"];
    const user = users[userID];
    if (user) {
      templateVars.user = user;
    }
  }
  res.redirect(longURL);
});

/**
 * Endpoint to fetch the registration page
 */
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


