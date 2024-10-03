var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;

var accX, accY, accZ;
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';

(async function() {
  let client = await MongoClient.connect(connectionString,
    { useNewUrlParser: true });

  let db = client.db('sensor');
  try {
    const res = await db.collection("data").insertOne({ x: 1 });

    console.log(`res => ${JSON.stringify(res)}`);
  }
  finally {
    client.close();
  }
})()
  .catch(err => console.error(err));

app.get("/", function (req, res) {
  res.redirect("index.html")
});

app.get("/sendData", function (req, res) {
  accX = req.query.x
  accY = req.query.y
  accZ = req.query.z
  req.query.time = new Date().getTime();

  client.open(function (err, p_client) {
    client.collection('accel', function (err, collection) {
      collection.insert(req.query, function (err, docs) {
        client.close();
      });
    });
  });
});


app.get("/getData", function (req, res) {
  var ret = {}

  ret.x = accX;
  ret.y = accY;
  ret.z = accZ;

  res.send(JSON.stringify(ret));
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
