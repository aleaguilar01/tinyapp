/**
 * Backend endpoint colecction for TinyApp.
 * @author Alejandra Aguilar
 */

/**
 * Dependencies
 */
const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

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
app.use(cookieSession({
  name: 'session',
  keys: ['awesome-key-in-env-variable'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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
  s7n6yl: {
    longURL: "http://www.google.com",
    userID: "xvdrz"
  }
};
/**
 * users database
 */
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$tQBY1/PYoEWfIy7UxJGJa.AYJMeOLrAopwm8uyrqhLCOIoP6uSkPm", // purple-monkey-dinosaur
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$gH.prLh7OmsRjA8b.G/4WO5BcnrUTZo7BZddvfYogyw/fC6WYQ0ri", // dishwasher-funk
  },
  xvdrz: {
    id: "xvdrz",
    email: "test@e.com",
    password: "$2a$10$ai7poc2uDWfge5obkwS1kuTKbHG8NtYg9l71i/kbFzUD3LTO99nm2", // 123
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
    if (urlDatabase[url].userID === id) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
};

/**
 * Function to validate if user is valid and logged in
 * @param {object} req - The request object.
 * @param {object} res - The response object
 * @returns {string}
*/
const validateLogin = (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).render("status401");
  } else {
    return userId;
  }
};

/**
 * Function that validates ownership of a URL in the database and executes a callback
 * if valid.
 * @param {object} req - The request object.
 * @param {object} res - The response object
 * @param {Function} callback - Callback function to execute if url ownership is valid
 * @returns {string} - Id of the valid url
 */
const validateUrlOwnership = (req, res, callback)=> {
  const userID = validateLogin(req, res);
  if (userID) {
    const id = req.params.id;
    // Checks if the id exists in the database
    const urlObject = urlDatabase[id];
    if (urlObject) {
      // Validates ownership of the URL
      if (urlObject.userID === userID) {
        callback(id, users[userID]);
      } else {
        res.status(403).render("status403");
      }
    } else {
      res.status(404).render("status404");
    }
  }
  
};

/////////////////////////////////// ENDPOINTS ///////////////////////////////////////////////

app.get("/", (req, res) => {
  res.redirect("/urls");
});

/**
 * Endpoint to create tiny urls and save them in memory database
 */
app.post("/urls", (req, res) => {
  const userID = validateLogin(req, res);
  const uuid = generateRandomString(6);
  urlDatabase[uuid] = {
    longURL: req.body.longURL,
    userID
  };
  res.redirect(`/urls/${uuid}`);
});

/**
 * Endpoint to delete urls from database.
 */
app.post("/urls/:id/delete", (req, res) => {
  validateUrlOwnership(req, res, (id)=>{
    delete urlDatabase[id];
    res.redirect("/urls");
  });
});

/**
 * Endpoint to update urls on database.
 */
app.post(`/urls/:id`, (req, res) => {
  validateUrlOwnership(req, res, (id)=>{
    urlDatabase[id].longURL = req.body.updatedURL;
    res.redirect("/urls");
  });
});

/**
 * Endpoint to login user.
 */
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if (user !== null) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
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
  req.session.userId = null;
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
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = generateRandomString(6);
    users[userId] = {
      id: userId,
      email,
      password: hashedPassword
    };
    req.session.userId = users[userId].id;
    res.redirect(`/urls`);
  }
});

/**
 * Endpoint to fetch all urls saved in the database
 */
app.get("/urls", (req, res) => {
  const userID = validateLogin(req, res);
  if (userID) {
    const user = users[userID];
    const templateVars = {
      user,
      urls: urlsForUser(userID),
    };
    res.render("urls_index", templateVars);
  }
});

/**
 * Endpoint to fetch the form to submit a long URL.
 */
app.get("/urls/new", (req, res) => {
  const userID = validateLogin(req, res);
  if (userID) {
    const templateVars = {
      user: users[userID]
    };
    res.render("urls_new", templateVars);
  }
});

/**
 * Endpoint to fetch one url saved in the database
 */
app.get(`/urls/:id`, (req, res) => {
  validateUrlOwnership(req, res, (id, user)=>{
    const urlObject = urlDatabase[id];
    const longURL = urlObject.longURL;
    const templateVars = { id, longURL, user };
    res.render("urls_show", templateVars);
  });
});

/**
 * Endpoint to redirect to long URL.
 */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
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
  if (!req.session.userId) {
    res.render("register.ejs");
  } else {
    res.redirect("/urls");
  }
});

/**
 * Endpoint to fetch the login page
 */
app.get("/login", (req, res) => {
  if (!req.session.userId) {
    res.render("login.ejs");
  } else {
    res.redirect("/urls");
  }
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


