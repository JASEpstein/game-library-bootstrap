var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const dashboardRouter = require("./routes/dashboard");         
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");

var app = express();

//Creates the Okta objects that interact with Okta API
var oktaClient = new okta.Client({
  orgUrl: 'dev-9766097.okta.com',
  token: '0022tVFQP32JMy8NOmwUpT3VoG3iUE9b0C9QPR6DJ-'
});
const oidc = new ExpressOIDC({
  issuer: "https://dev-9766097.okta.com/oauth2/default",
  client_id: '0oa390ex1YM2M7LG75d6',
  client_secret: 'iPqPBGUao252LPzgmXhJbk8DI197omtMFFthv7PI',
  redirect_uri: 'http://localhost:3000/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'opajeo;hpowuehpofajsofjpw',
  resave: true,
  saveUninitialized: false
}));

//Runs the okta router
app.use(oidc.router);

//Creates user object to use when checking user info or status
app.use((req, res, next) => {
  //If not logged in, do nothing
  if (!req.userinfo) {
    return next();
  }

  //If user logged in, get user's info and instantiate
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

//Only allows a user to visit a URL if they're logged in
function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

app.use('/', publicRouter);
app.use('/dashboard', loginRequired, dashboardRouter);
app.use('/users', usersRouter);

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
