var http = require('http')
  , express = require('express')
  , OAuth= require('oauth').OAuth
  , request = require('request')
  , querystring = require('querystring')
  , routes = require('./routes')
  , keys = require('./twitterkeys')
  , config = require('./config.js')
  , utils = require('./utils');

// I decided to use Express so as not to be concerned with simple operations like routing 
// More on this can be found in the README
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser("dRewabraPhUxes9akemaPheW"));
  app.use(express.session());
});

var callback = 'http://localhost:' + config.port + '/callback';

var getTwitter = new OAuth('https://api.twitter.com/oauth/request_token', 
                   'https://api.twitter.com/oauth/access_token', 
                   keys.consumer_key,
                   keys.consumer_secret, 
                   '1.0',
                   callback, 
                   'HMAC-SHA1');

/* ROUTES */

app.get('/', function(req, res) {
  console.log(req.session.oauth);
  res.render('index', { title: 'My Twitter App' });
});

app.get('/login', function(req, res) {
  
    getTwitter.getOAuthRequestToken(function(error, token, secret, results) {
        if (error) {
            console.log(error);
        } else {
            req.session.oauth = {};
            req.session.oauth.token = token;
            req.session.oauth.token_secret = secret;

            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + token);
        }
    });
});

app.get('/callback', function(req, res, next) {

    if (req.session.oauth !== undefined) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;
        getTwitter.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, token, secret, results) {
            if (error) {
                console.log(error);
            } else {
                req.session.oauth.access_token = token;
                req.session.oauth.access_token_secret = secret;
                req.session.oauth.screen_name = results.screen_name;

                console.log(results);
                console.log('User authenticated to Twitter');
                
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});



app.listen(config.port);
console.log('Server started on port ' + config.port);
