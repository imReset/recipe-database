require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Recipe = require('./models/recipe');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(  
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.static(`${__dirname}/public`));

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/recipes');
      });
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', (req, res) => {});

app.get('/new', (req, res) => {
  res.sendFile(`${__dirname}/recipe.html`);
});

app.post('/new', (req, res) => {
  const newRecipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    calories: req.body.calories,
    carbs: req.body.carbs,
    protein: req.body.protein,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    video: req.body.video,
    slug: req.body.title.toLowerCase().split(' ').join('-'),
  });
  newRecipe.save();
  res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    res.render('recipes', {
      recipeList: recipes,
    });
  });
});

app.get('/recipes/:slug', (req, res) => {
  const { slug } = req.params;
  Recipe.find({ slug }, (err, recipe) => {
    if (err) return res.send(500, { error: err });
    if (!recipe) return res.send(404, { error: 'Not found' });
    res.render('recipes', { recipe });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
