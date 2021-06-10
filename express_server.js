const { generateRandomString } = require('./dev/generateRandomString')
const { getUserByEmail } = require('./helpers')

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


const bcrypt = require('bcrypt');



app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const users = {}

app.get("/", (req, res) => {
  const user_id = req.session.user_id
  !user_id? res.render('home', {user: {}}) : res.render('urls_index', {urls: urlDatabase, user: users[user_id]});
});

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id
  const templateVars = {urls: urlDatabase, user: users[user_id]};
  !user_id? res.redirect('/login') : res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL/edit", (req, res) => {
  const user_id = req.session.user_id
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    edit: true,
    user: users[user_id]
  };
  res.render('urls_show', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id
  if (!user_id) {
    res.redirect('/login') 
  }

  const userDB = {}
  Object.keys(urlDatabase).filter(tinyUrl => urlDatabase[tinyUrl].userID === user_id).forEach(tinyUrl => {
      const longURL = urlDatabase[tinyUrl].userID;
      userDB[tinyUrl] = { longURL, user_id }
    })
  const shortURL = req.params.shortURL;
  if (Object.keys(userDB).some(tinyUrl => tinyUrl === shortURL))
  {
    const templateVars = {
      urls: userDB,
      shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      edit: false,
      user: users[user_id]
    };
    res.render('urls_show', templateVars);
  }
  else res.status(403).send('Forbidden')
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL].longURL;
  res.redirect(url)
});

app.get("/register", (req, res) => {
  const user_id = req.session.user_id
  !user_id? res.render('regist_form', {user: {}}) : res.redirect('/');
});

app.get("/login", (req, res) => {
  const user_id = req.session.user_id
  !user_id? res.render('login_form', {user: {}}) : res.redirect('/');
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls')
});

app.post("/urls", (req, res) => {
  const user_id = req.session.user_id

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  if(!urlDatabase[shortURL]) urlDatabase[shortURL] = { longURL, userID:user_id}
  else{
    urlDatabase[shortURL].longURL = longURL;
    urlDatabase[shortURL].userID = user_id;
  }

  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    edit: false,
    user: users[user_id]
  };
  res.render('urls_show', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const user = getUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, users[user.id].password)) {
    res.status(403).send('Something went wrong!')
  } else {
    req.session.user_id = user.id;
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls')
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  if (!password || !email || getUserByEmail(email, users)) {
    res.status(400).send('Something went wrong!')
  } else {
    const id = generateRandomString();
    users[id] = { id, email, password }
    req.session.user_id = id;
    res.redirect('/urls');
  }
});
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

