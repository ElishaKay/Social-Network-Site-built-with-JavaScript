var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');


mongoose.Promise = global.Promise;


// For development purposes, uncomment this line:
// mongoose.connect('mongodb://localhost/beers');


// For deployment purposes uncomment this line:
mongoose.connect(process.env.MONGOLAB_PUCE_URI ||'mongodb://localhost/beers');




var Beer = require("./models/BeerModel");
var Review= require('./models/ReviewModel');

var app = express();

// for fb authenticate
app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static('public'));
app.use(express.static('node_modules'));


// Change the callbackURL you see below
// every time that youre developing locally
// vs deploying to heroku domain

passport.use(new FacebookStrategy({
    clientID: '1886152074941466',
    clientSecret: '1d9904d87a3e1b3a0b46692cadcc26ef',
    
    // For development
    // callbackURL: "http://localhost:8000/auth/facebook/callback",
    
    // For Deployment
    callbackURL: "https://letsamp.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },

    function(accessToken, refreshToken, profile, done) {
    console.log("accessToken:");
    console.log(accessToken);

    console.log("refreshToken:");
    console.log(refreshToken);

    console.log("profile:");
    console.log(profile);

    return done(null, profile);
  }
));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});


// To see just the JSON that facebook returns back, 
// simply uncomment this line


  // route for showing the profile page
  app.get('/profile', function(req, res) {
    console.log(req.user);
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/facebookCanceled'
  }));

app.get('/profile', function(req, res) {
  res.json(req.user);
});

app.get('/facebookCanceled', function(req, res) {
  res.send("fail!");
});


// app.use('/userPage', facebookAuthenticate(req, res, next));


// app.get('/userPage', fucntion(req, res){
//   res.send('userPage.html')
// })

app.get('/', function (req, res) {
  res.send("You are inside the fullstack project")
});

app.get('/beers', function (req, res) {

  Beer.find(function (error, beers) {
    res.send(beers);
  });
});

app.post('/beers', function (req, res, next) {
  console.log(req.body);

  var beer = new Beer(req.body);
  
  beer.save(function(err, beer) {
    if (err) { return next(err); }
    res.json(beer);
  });
});



app.delete('/beers/:id', function (req, res) {

  
  res.send('DELETE request to homepage');


  Beer.findByIdAndRemove(req.params.id, function(err) {
    if (err) throw err;

    // we have deleted the person
    console.log('Person deleted!');
  });


});


app.post('/beers/:id/reviews/', function(req, res, next) {

// req === {
//   date: '1/12/16', 
//   body: {name: "Daniel", text: "gross"},
//   params: {id: 123}
// }

// req.params.id === 123
// req.body === {name: "Daniel", text: "gross"}

// db.beers.findById() cousins with Beer.findById 
// Beer is the name of the schema, same way we search through a collection
  Beer.findById(req.params.id, function(err, foundBeer) {
    //foundBeer is the success funct of the beer we found in the database
    // we create a function within the function because once we
    // find the beer, we want to create and push a review object
    if (err) { return next(err); }

    var review = new Review(req.body);

    foundBeer.reviews.push(review);
      
    foundBeer.save(function (err, review) {
      if (err) { return next(err); }

      res.json(review);
    });  
  });
});


// fb auth
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));



// // For development, uncomment this line
// app.listen(8000);

app.listen(process.env.PORT || '8000');