var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

var accX, accY, accZ;
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';



app.get("/", function (req, res) {
  res.redirect("index.html")
});

app.get("/sendData", function (req, res) {
  accX = req.query.x
  accY = req.query.y
  accZ = req.query.z
  req.query.time = new Date().getTime();

  var result = "0";
  (async function() {
    let client = await MongoClient.connect(connectionString,
      { useNewUrlParser: true });
    let db = client.db('sensorData');
    try {
      result = await db.collection("data").insertOne(req.query);
      if(result.insertedId) {
        result = result.insertedId.toString();
        console.log(result);
      }
    }
    finally {
      client.close();
      res.end(result);
    }
  })().catch(err => console.error(err));
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
