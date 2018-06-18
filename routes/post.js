var router = require("express").Router();
var CONNECTION_URL = require("../config/mongodb.config.js").CONNECTION_URL;
var MongoClient = require("mongodb").MongoClient;
process.on('unhandledRejection', console.dir);

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL).then((client) => {
    var db = client.db("weblog");
    var query = {
      url: { $eq: req.url }
    };
    return db.collection("posts")
      .findOne(query);
  }).then((data) => {
    res.render("./post/index.ejs", data);
  }).catch((err) => {
    throw err;
  });
});

module.exports = router;