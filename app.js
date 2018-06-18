var express = require("express");
var app = express();
var accesslogger = require("./lib/logger/accesslogger.js");
var systemlogger = require("./lib/logger/systemlogger.js");
var bodyParser = require("body-parser");
var accountcontrol = require("./lib/security/accountcontrol.js")
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var app = express();
const SESSION_SECRET = require("./config/app.config.js").security.SESSION_SECRET;

app.set("view engine", "ejs");


app.use("/public", express.static(__dirname + "/public"));

app.use(accesslogger());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
  secret: SESSION_SECRET, resave: false, saveUninitialized: true, name: "sid"
}));
app.use(...accountcontrol.initialize());


app.use("/", require("./routes/index.js"));
app.use("/post", require("./routes/post.js"));
app.use("/search", require("./routes/search.js"));
app.use("/account", require("./routes/account.js"));

app.use(systemlogger());

app.listen(3000);