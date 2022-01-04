require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const chalk = require('chalk');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// use for google signin
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//use for facebook
const FacebookStrategy = require('passport-facebook').Strategy;

const findOrCreate = require('mongoose-findorcreate');

//Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const customerRouter = require('./routes/customerList');
const addEditCustomerRouter = require('./routes/addEditCustomer');
const customerDetailRouter = require('./routes/customerDetail');
const productConfigRouter = require('./routes/productConfig');
const logoutRouter = require('./routes/logout');

const app = express();

const { 
  CALLBACK_DOMAIN = 'www.dunrite-clients.com',
  PROTOCOL = 'https'
 } = process.env;

app.use(session({
  secret: 'Our littee secret.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  userFirstName: String,
  userLastName: String,
  email: String,
  password: String
});


const customerSchema = new mongoose.Schema({
  customerFirstName: String,
  customerLastName: String,
  phone: Number,
  email: String,
  street: String,
  city: String,
  postcode: String,
  country: String,
  hottubModel: {
    brand: String,
    model: String
  },
  comments: String
});

const productSchema = new mongoose.Schema({
  hottub: {
    brandName: String,
    model: [String]
  }
});

const workSchema = new mongoose.Schema(
    {
      customerId: String,
      date: {type: Date, default: Date.now},
      service: String
    });

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Product = mongoose.model('Product', productSchema);
const Work = mongoose.model('Work', workSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${PROTOCOL}://${CALLBACK_DOMAIN}/auth/google/customerList`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
function(token, tokenSecret, profile, done) {
  //console.log(JSON.stringify(profile));
    User.findOrCreate({ userFirstName: profile.name.givenName, 
                        userLastName: profile.name.familyName, 
                        username: profile.id, 
                        email: profile.emails[0].value 
                      }, function (err, user) {
      return done(err, user);
    });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${PROTOCOL}://${CALLBACK_DOMAIN}/auth/facebook/customerList`
},
function(accessToken, refreshToken, profile, done) {
  // console.log(JSON.stringify(profile));
  const names =  profile._json.name.split(' ');
  const fName = names[0];
  const lName = names[1];
  User.findOrCreate({ userFirstName: fName,
                      userLastName: lName,
                      username: profile.id
                    }, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  req.User = User;
  req.Customer = Customer;
  req.Product = Product;
  req.Work = Work;
  req.passport = passport;
  req.chalk = chalk;
  next();
});

//use all routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/customerList', customerRouter);
app.use('/addEditCustomer', addEditCustomerRouter);
app.use('/customerDetail', customerDetailRouter);
app.use('/productConfig', productConfigRouter);
app.use('/logout', logoutRouter);

//google authentication
app.get('/auth/google', 
passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/customerList', 
passport.authenticate('google', {failureRedirect: '/'}),
(req, res) => {
  res.redirect('/customerList');
});

//facebook authentication
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'public_profile,email', return_scopes: true}));

app.get('/auth/facebook/customerList',
  passport.authenticate('facebook', { successRedirect: '/customerList',
                                      failureRedirect: '/' }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
