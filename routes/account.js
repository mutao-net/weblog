const CONNECTION_URL = require("../config/mongodb.config.js").CONNECTION_URL;
var router = require("express").Router();
var MongoClient = require("mongodb").MongoClient;
var { authenticate, authorize } = require("../lib/security/accountcontrol.js");

var validate = function (body) {
  var valid = true, errors = {};

  if (!body.url) {
    errors.url = "URLは必須項目です。";
    valid = false;
  }

  if (!body.title) {
    errors.title = "タイトルは必須項目です。";
  }
  return valid ? undefined : errors;
};

var createRegistData = function (body) {
  var datetime, data;
  datetime = new Date();
  data = {
    url: body.url,
    published: datetime,
    updated: datetime,
    title: body.title,
    content: body.content,
    keywords: body.keywords ? (body.keywords || "").split(",") : "",
    authors: body.authors ? (body, authors || "").split(",") : ""
  };
  return data;
};

router.get("/", authorize("owner"), (req, res) => {
  console.log("kitayo");
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
})

router.post("/login", authenticate());

router.post("/logout", authorize("owner"), (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/post/regist", (req, res) => {
  res.render("./account/post/regist-form.ejs");
});


router.post("/post/regist", (req, res) => {
  var body = req.body;
  var errors = validate(body);
  var original = createRegistData(body);


  //original=inputdata
  if (errors) {
    res.render("./account/post/regist-form.ejs", { errors, original });
    return;
  }
  MongoClient.connect(CONNECTION_URL).then((client) => {
    var db = client.db("weblog");
    return db.collection("posts").insertOne(original);
  }).then((reslut) => {
    res.render("./account/post/regist-complete.ejs");
  }).catch((err) => {
    errors = {
      db: err.message
    };
    res.render("./account/post/regist-form.ejs", { errors, original });
  });
});

module.exports = router;