const express = require('express');
const mustacheExpress = require('mustache-express');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/robots';
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const model = require("./model");
const user = model.User;

const app = express();

mongoose.connect('mongodb://localhost/test');

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.use(express.static('public'));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.authenticate(username, password, function(err, user){
      if (err){
        return done(err)
      }
      if (user){
        return done(null, user)
      }else{
        return done(null, false, {
          message:"No user with that username and password is found."
        })
      }
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: 'Master Rahool',
  resave: false,
  saveUninitialized: false,
  store: new(require('express-sessions'))({
    storage: 'mongodb'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next){
  res.locals.user = req.user;
  next();
})

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
  notForHire.find({"company" : {$ne: null}
  }).toArray(function(err, result) {
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

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.get('/', function (req, res) {
     res.render("allRobos");
   })

app.post('/login/', passport.authenticate('local', {
  sucessRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))
app.get('/register/', function(req, res) {
       res.render('register');
   });

  app.post('register/', function(req, res) {
    req.checkBody('username', 'Username must be alphanimeric').isAlphanumeric();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    req.getValidationResult()
    .then(function(result){
      if (!result.isEmpty()) {
        return res.render("register", {
        username: req.body.username,
        errors: result.mapped()
      });
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })

    const error = user.validateSync();
    if (error) {
      return res.render("register", {
        errors: normalizeMongooseErrors(error.errors)
      })
    }

    user.save(function(err) {
      if (err) {
        return res.render("register", {
          messages: {
            error: ["That username is taken."]
          }
        })
      }
      return res.redirect('/');
    })
  })
});

app.get('/logout/', function(req, res) {
    req.logout();
    res.redirect('/');
});

const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/');
  }
}

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
     res.render('employedrobots', {users : result} );
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
