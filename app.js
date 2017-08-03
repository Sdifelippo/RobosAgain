const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/robots';

var findBrokeRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find({"job" : null}).toArray(function(err, result) {
    console.log("found", result.length, "users")
    callback(result);
  });
}
var findAllRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find().toArray(function(err, result) {
    console.log("found ", result.length, "users")
    callback(result);
  });
}
var findEmployedRobots = function(db, callback) {
  var notForHire = db.collection('robots');
  notForHire.find({"company" : 'string' }).toArray(function(err, result) {
    console.log("found", result.length, "users");
    callback(result);
  });
}

MongoClient.connect(url, function(err, db) {
  console.log('error?' , err);
  console.log("We have connected");


  findBrokeRobots(db, function() {
    console.log('Search done. Peace.');
    db.close();
  });
});
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello there! Do you need ' + `<a href="http://localhost:3000/indexrobots">Robots?</a>`);
});

app.get('/indexrobots', function(req, res) {
  MongoClient.connect(url, function(err, db) {
   findAllRobots(db, function(result) {
     res.render('allRobos', {users : result} );
   });
 });
});

app.get('/brokerobots', function(req, res) {
  MongoClient.connect(url, function(err, db) {
   findBrokeRobots(db, function(result) {
     res.render('allRobos', {users : result} );
   });
 });
});

app.get('/employedrobots', function(req, res) {
  MongoClient.connect(url, function(err, db) {
   findEmployedRobots(db, function(result) {
     res.render('allRobos', {users : result} );
   });
 });
});

app.get('/robot/:id', function(req, res) {
  MongoClient.connect(url, function(err, db) {
   findAllRobots(db, function(result) {
     let robot = result.find(function(broke){
       return broke.username.toLowerCase() === req.params.id;
     });
     res.render('oneRobo', robot);
   });
 });
});
// // Use connect method to connect to the server

    app.listen(3000, function (){
    console.log('I have the waters of lake Minnetonka!!');
  });
