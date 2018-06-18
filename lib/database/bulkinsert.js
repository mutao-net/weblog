var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://user:user@localhost:27017/weblog";

MongoClient.connect(url, (err, client) => {
  if (err) {
    return;
  }
  var db  =client.db("weblog");

  var bulk = db.collection("posts").initializeOrderedBulkOp();
  bulk.insert({
    url: "/2017/05/hello-nodejs.html",
    published: new Date(2017, 4, 2),
    updated: new Date(2017, 4, 2),
    title: "ようこそ Node.js の世界へ",
    content: "Node.js は おもしろい！",
    keywords: ["Node.js"],
    authors: ["Hiromu Sasaki"]
  });
  bulk.insert({
    url: "/2017/06/nodejs-basic.html",
    published: new Date(2017, 5, 12),
    updated: new Date(2017, 5, 12),
    title: "Node.js の 基本",
    content: "ちょっと難しくなってきた！？",
    keywords: ["Node.js"],
    authors: ["Hiromu Sasaki"]
  });
  bulk.insert({
    url: "/2017/07/advanced-nodejs.html",
    published: new Date(2017, 7, 8),
    updated: new Date(2017, 7, 8),
    title: "Node.js 応用",
    content: "Node.js で Excel ファイルが触れるなんて！！",
    keywords: ["Node.js"],
    authors: ["Hiromu Sasaki"]
  });
  bulk.execute((err, result) => {
    db.collection("posts")
      .createIndex({ url: 1 }, { unique: true, background: true }, (err, result) => {
        db.close();
      });
  });
});

MongoClient.connect(url).then((client) => {
  var db  =client.db("weblog");
  
  return Promise.all([
    db.collection("users")
      .insertOne({
        email: "sasaki.h1026@gmail.com",
        name: "Hiromu Sasaki",
        password: "qwerty",
        role: "owner"
      }),
    db.collection("users")
      .createIndex({ email: 1 }, { unique: true, background: true })
  ]).then((results) => {
    db.close();
  });
}).catch((err) => {

});