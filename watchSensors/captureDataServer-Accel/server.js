var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;

var accX, accY, accZ;

// connect to database
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


// Use connect method to connect to the server
client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db('myProject');
  const collection = db.collection('accel');
  // Insert some documents
  collection.insertMany([
    {x : 1, y : 2, z : 3},
    {x : 4, y : 5, z : 6},
    {x : 7, y : 8, z : 9}
  ], function(err, result) {
    console.log("Inserted 3 documents into the collection");
  });
  client.close();
});

app.get("/", function (req, res) {
    res.redirect("index.html")
});

app.get("/sendData", function (req, res) {
    accX = req.query.x
    accY = req.query.y
    accZ = req.query.z
    req.query.time = new Date().getTime();

    client.open(function (err, p_client) {
        client.collection('accel', function(err, collection) {
            collection.insert(req.query, function(err, docs) {
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
