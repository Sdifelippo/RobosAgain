const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

// app.engine('mustache', mustacheExpress());

var mongoRobo = require('mongodb').MongoClient;
//
var url = 'mongodb://localhost:27017/robots';
//
var findBrokeRobots = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('robots');
  // Insert some documents
  collection.find({ "company" : null}).toArray(function(err, result) {
    console.log("found ", result.length, " robots need work ")
    callback(result);
  });
}
   res.render("unemplyed", {robots: foundEmployeed});
  });
});

app.get("/unemployed", (req, res) => {
  results.find({ job : null }).toArray(function(err, foundEmployeed) {
    if (err) {
      console.warn("Error finding robots robotdb", err);
    }
// // Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  console.log('error?', err);
  console.log("Waters from Lake Minnetonka, I'm Alive!!");

  findBrokeRobots(db, function() {
    console.log("I have the waters of lake Minnetonka!!");
    db.close();
  });
});
