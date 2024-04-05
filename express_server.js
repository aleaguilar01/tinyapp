/**
 * Backend endpoint colecction for TinyApp.
 * @author Alejandra Aguilar
 */

/**
 * Dependencies
 */
const express = require("express");
const cookieParser = require("cookie-parser");

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
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  s9m5xK: {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },
};
/**
 * users database
 */
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////////////////////// HELPERS ///////////////////////////////////////////////

/**
 * Function to generate a random string thar will be use as a unique identifier for tinyurls
 * @param {number} lengthOfId
 * @returns {string}
 */
const generateRandomString = (lengthOfId) => {
  let randomString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let n = 0; n < lengthOfId; n++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

/**
 * Function to check if an user exists into the database.
 * @param {string} id
 * @param {object} database
 * @returns {object}
 */

const getUserByEmail = (email) => {
  const id = Object.keys(users).find(key => users[key].email === email);
  if (id) {
    return users[id];
  }
  return null;
};

/**
 * Function to obtain the urls for a particular user
 * @param {string} id
 * @returns {object}
 */

const urlsForUser = (id) => {
  const userUrls = {};
  for (let url in urlDatabase) {
    console.log(urlDatabase[url].userID);
    if (urlDatabase[url].userID === id) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
};


/////////////////////////////////// ENDPOINTS ///////////////////////////////////////////////

app.get("/", (req, res) => {
  res.redirect("/urls");
});

/**
 * Endpoint to create tiny urls and save them in memory database
 */
app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.status(401).render("status401.ejs");
  } else {
    const uuid = generateRandomString(6);
    urlDatabase[uuid] = {
      longURL: req.body.longURL,
      userID: req.cookies["user_id"]};
    res.redirect(`/urls/${uuid}`);
  }
});

/**
 * Endpoint to delete urls from database.
 */
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    res.status(401).render("status401");
  } else {
    const id = req.params.id;
    const urlObject = urlDatabase[id];
    if (urlObject) {
      if (urlObject.userID === userId) {
        delete urlDatabase[id];
        res.redirect("/urls");
      } else {
        res.status(403).render("status403");
      }
    } else {
      res.status(404).render("status404.ejs");
    }
  }
});

/**
 * Endpoint to update urls on database.
 */
app.post(`/urls/:id`, (req, res) => {
  const id = req.params.id;
  urlDatabase[id].longURL = req.body.updatedURL;
  res.redirect("/urls");
});

/**
 * Endpoint to login user.
 */
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if (user !== null) {
    const id = user.id;
    if (password === users[id].password) {
      res.cookie("user_id", users[id].id);
      res.redirect("/urls");
    } else res.status(403).send("Password incorrect. Please try again.");
  } else {
    res.status(403).send("User can not be found. Please login with a correct email or register first.");
  }
});

/**
 * Endpoint to logout user.
 */
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

/**
 * Endpoint to register users and update the database.
 */
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const exisitingUser = getUserByEmail(email);
  if (exisitingUser || !email || !password) {
    const templateVars = {exisitingUser, email, password};
    res.status(400).render("status400.ejs", templateVars);
  } else {
    const userId = generateRandomString(6);
    users[userId] = {
      id: userId,
      email,
      password
    };
    res.cookie('user_id', users[userId].id);
    res.redirect(`/urls`);
  }
});

/**
 * Endpoint to fetch all urls saved in the database
 */
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    res.status(401).render("status401");
  } else {
    const user = users[userId];
    const templateVars = {
      user,
      urls: urlsForUser(userId),
    };
    res.render("urls_index", templateVars);
  }
});

/**
 * Endpoint to fetch the form to submit a long URL.
 */
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.status(401).render("status401");
  } else {
    const templateVars = {};
    if (req.cookies["user_id"]) {
      const userID = req.cookies["user_id"];
      const user = users[userID];
      if (user) {
        templateVars.user = user;
      }
    }
    res.render("urls_new", templateVars);
  }
});

/**
 * Endpoint to fetch one url saved in the database
 */
app.get(`/urls/:id`, (req, res) => {
  if (!req.cookies["user_id"]) {
    res.status(401).render("status401");
  } else {
    const id = req.params.id;
    const userID = req.cookies["user_id"];
    const urlObject = urlDatabase[id];
    if (urlObject) {
      const longURL = urlObject.longURL;
      const user = users[userID];
      if (urlObject.userID === userID) {
        const templateVars = { id, longURL, user };
        res.render("urls_show.ejs", templateVars);
      } else {
        res.status(403).render("status403");
      }
    } else {
      res.status(404).render("status404.ejs");
    }

    
  }
  
});

/**
 * Endpoint to redirect to long URL.
 */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const templateVars = {};
  if (req.cookies["user_id"]) {
    const userID = req.cookies["user_id"];
    const user = users[userID];
    if (user) {
      templateVars.user = user;
    }
  }
  if (!urlDatabase[id]) {
    res.status(404).render("status404.ejs");
  } else {
    res.redirect(longURL);
  }
});

/**
 * Endpoint to fetch the registration page if the user is not already loged in
 */
app.get("/register", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.render("register.ejs");
  } else {
    res.redirect("/urls");
  }
});

/**
 * Endpoint to fetch the login page
 */
app.get("/login", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.render("login.ejs");
  } else {
    res.redirect("/urls");
  }
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


