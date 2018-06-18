const CONNECTION_URL = require("../../config/mongodb.config.js").CONNECTION_URL;
var MongoClient = require("mongodb").MongoClient;
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var initialize, authenticate, authorize;

passport.serializeUser((email, done) => {
  done(null, email);
});

passport.deserializeUser((email, done) => {
  MongoClient.connect(CONNECTION_URL).then((client) => {
    var db = client.db("weblog");
    return db.collection("users")
      .findOne({ email: { $eq: email } });
  }).then((user) => {
    done(null, {
      email: user.email,
      name: user.name,
      role: user.role
    });
  }).catch((err) => {
    done(err);
  });
});

//login
passport.use(
  "local-login",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, (req, username, password, done) => {
    MongoClient.connect(CONNECTION_URL).then((client) => {
      console.log(username);
      var db = client.db("weblog");
      return db.collection("users").findOne({
        email: { $eq: username },
        password: { $eq: password }
      });
    }).then((user) => {
      done(null, user.email);
    }).catch((err) => {
      console.log(err);
      done(null, false, req.flash("message", "ログインに失敗しました。"));
    });
  }
  )
);

//初期化処理
initialize = function () {
  return [
    passport.initialize(),
    passport.session(),
    //
    function (req, res, next) {
      if (req.isAuthenticated()) {
        res.locals.user = req.user;
      }
      next();
    }
  ];
};

//認証
authenticate = function () {
  return passport.authenticate(
    "local-login", {
      successRedirect: "/account/",
      failureRedirect: "/account/login"
    }
  );
};

//認可
authorize = function (role) {
  return function (req, res, next) {
    if (req.isAuthenticated &&
      req.user.role === role) {
      next();
    } else {
      console.log(req.user.role);
      console.log(role);
      
      res.redirect("/account/login");
    }
  };
};

module.exports = {
  initialize,
  authenticate,
  authorize
};