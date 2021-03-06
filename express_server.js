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
  userId ? res.redirect('/urls') : res.redirect('/login');
});

app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  userId ? res.render('urls_index', {urls: urlDatabase, user: users[userId]}) : res.redirect('/login');
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  userId ? res.render('urls_new', {user: users[userId]}) : res.redirect('/');
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(403).send('You must be logged in to view URLs!');
  } else {

    const userDB = getUserDatabase(userId, urlDatabase);

    const shortURL = req.params.shortURL;
    if (userHasUrl(userDB, shortURL)) {
      const templateVars = {
        shortURL,
        urls: userDB,
        longURL: urlDatabase[shortURL].longURL,
        user: users[userId],
      };
      res.render('urls_show', templateVars);
    } else if (urlDatabase[shortURL]) {
      res.status(403).send("You can't access URLs that don't belong to you!");
    } else {
      res.status(404).send('Not found - Error 404');
    }
  }
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  url ? res.redirect(url.longURL) : res.status(404).send('Not found - Error 404');
});


app.get("/register", (req, res) => {
  const userId = req.session.userId;
  userId ? res.redirect('/urls') : res.render('regist_form', {user: {}});
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  userId ? res.redirect('/urls') : res.render('login_form', {user: {}});
});

/**POST */

app.post("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  } else {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
    res.redirect('/urls');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  } else {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  }
});

app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  } else {
    //Need to use some classes in here! probably a Url Class
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;
    if (!urlDatabase[shortURL]) urlDatabase[shortURL] = { longURL, userID:userId};
    else {
      urlDatabase[shortURL].longURL = longURL;
      urlDatabase[shortURL].userID = userId;
      console.log(urlDatabase);
    }
    res.redirect(`/urls/${shortURL}`);
  }
});

app.post('/login', (req, res) => {
  
  //Here will go better with a User Class
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  //Could have modularized in here a little bit as User class methods
  if (!user) {
    res.status(403).send('User does not exist: Please verify your email address or register first!');
  } else {
    if (!bcrypt.compareSync(password, users[user.id].password)) {
      res.status(403).send('Wrong Password!');
    } else {
      req.session.userId = user.id;
      res.redirect('/urls');
    }
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

  if (!email) res.status(400).send(`No email provided!`);
  if (!password) res.status(400).send(`No password provided!`);
  if (getUserByEmail(email, users)) res.status(400).send(`email provided already exists!`);

  const id = generateRandomString();
  users[id] = { id, email, password };
  req.session.userId = id;
  res.redirect('/urls');

});

//***********************************************************/


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

