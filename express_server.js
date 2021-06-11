/**Helpers */
const { getUserByEmail, getUserDatabase, userHasUrl, generateRandomString} = require('./helpers');


/**Server Setup */
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const bcrypt = require('bcrypt');

app.set("view engine", "ejs");

/**Databases */

const urlDatabase = {};
const users = {};

/**GET */


app.get("/", (req, res) => {
  const userId = req.session.userId;
  userId ? res.redirect('/urls') : res.render('home', {user: {}});
});

app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  userId ? res.render('urls_index', {urls: urlDatabase, user: users[userId]}) : res.redirect('/login');
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  userId ? res.render('urls_new') : res.redirect('/');
});


app.get("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  }
  const userDB = getUserDatabase(userId, urlDatabase);
  const shortURL = req.params.shortURL;
  if (userHasUrl(userDB, shortURL)) {
    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL].longURL,
      user: users[userId]
    };
    res.render('urls_show', templateVars);
  } else {
    res.status(403).send('Access denied - Error 403');
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  }

  const userDB = getUserDatabase(userId, urlDatabase);

  const shortURL = req.params.shortURL;
  if (userHasUrl(userDB, shortURL)) {
    const templateVars = {
      shortURL,
      urls: userDB,
      longURL: urlDatabase[shortURL].longURL,
      user: users[userId]
    };
    res.render('urls_show', templateVars);
  } else {
    res.status(403).send('Access denied - Error 403');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL].longURL;
  res.redirect(url);
});

app.get("/register", (req, res) => {
  const userId = req.session.userId;
  userId ? res.redirect('/') : res.render('regist_form', {user: {}});
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  userId ? res.redirect('/') : res.render('login_form', {user: {}});
});

/**POST */

app.post("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  }
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  }

  //Need to use some classes in here! probably a Url Class
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if (!urlDatabase[shortURL]) urlDatabase[shortURL] = { longURL, userID:userId};
  else {
    urlDatabase[shortURL].longURL = longURL;
    urlDatabase[shortURL].userID = userId;
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  
  //Here will go better with a User Class
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  //Could have modularized in here a little bit as User class methods
  if (!user || !bcrypt.compareSync(password, users[user.id].password)) {
    res.status(403).send('Something went wrong!');
  } else {
    req.session.userId = user.id;
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  
  //Again, Should have implemented a User Class + methods for encryption
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  if (!password || !email || getUserByEmail(email, users)) {
    res.status(400).send('Something went wrong!');
  } else {
    const id = generateRandomString();
    users[id] = { id, email, password };
    req.session.userId = id;
    res.redirect('/urls');
  }
});

//***********************************************************/


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

