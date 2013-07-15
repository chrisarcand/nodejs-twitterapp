var http = require('http')
  , express = require('express')
  , OAuth= require('oauth').OAuth
  , request = require('request')
  , querystring = require('querystring')
  , url = require('url')
  //, routes = require('./routes')
  , keys = require('./twitterkeys')
  , config = require('./config.js')
  , utils = require('./utils');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.cookieParser("dRewabraPhUxes9akemaPheW"));
  app.use(express.session());
});

var callback = 'http://localhost:' + config.port + '/callback';

var twitter = new OAuth('https://api.twitter.com/oauth/request_token', 
                   'https://api.twitter.com/oauth/access_token', 
                   keys.consumer_key,
                   keys.consumer_secret, 
                   '1.0',
                   callback, 
                   'HMAC-SHA1');

/* ROUTES */

app.get('/', function (req, res) {
  console.log('\n\nRoute \'/\' requested, session info:');
  console.log(req.session);
  if (!req.session.oauth || !req.session.oauth.screen_name) {
    res.render('login', { title: 'My super simplistic Node.js app' });
  }
  else {
    res.redirect('/search');
  }
});

app.get('/login', function (req, res) {  
  twitter.getOAuthRequestToken(function(error, token, secret, results) {
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

app.get('/logout', function (req, res) {
  // TODO: Could send POST to https://api.twitter.com/oauth2/invalidate_token to invalidate token
  req.session.oauth = null;
  res.redirect('/');
});

app.get('/callback', function (req, res, next) {
  if (req.session.oauth !== undefined) {
      req.session.oauth.verifier = req.query.oauth_verifier;
      var oauth = req.session.oauth;
      twitter.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, token, secret, results) {
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

app.get('/search', function (req, res) {
  if (req.session.oauth !== undefined && req.session.oauth.screen_name !== undefined) {
    var queryData = url.parse(req.url, true).query;
    if (!utils.isEmpty(queryData) && queryData['searchterm']) {
      console.log('Query submitted: ' + JSON.stringify(queryData));
      var apicall = 'https://api.twitter.com/1.1/search/tweets.json?q=' + queryData['searchterm'];
      console.log('API call: ' + apicall);
      var oauth = {
          consumer_key: keys.consumer_key,
          consumer_secret: keys.consumer_secret,
          token: req.session.oauth.access_token,
          token_secret: req.session.oauth.access_token_secret
      };
      console.log('oauth used for call: ' + JSON.stringify(oauth));
      request.get({
          url: apicall,
          oauth: oauth,
          json: true
      }, function(error, response, body) {
          if (error) {
              console.log('Uh oh. An error! : ' + error);
          } else {
            console.log('JSON returned from Twitter: ');
            utils.ppJSON(body);
            var tweets = body.statuses;
            res.render('index', { title: 'Results of \'' + queryData['searchterm'] + '\'', tweets: tweets });
          }
      });
    } else {
      //No query string, so just show the search field
      res.render('index', { title: 'My super simplistic Tweet Search', tweets: {}});
    }
  } else {
      //Not authorized, so send to root for authorization
      res.redirect("/");
  }
});

app.get('/timeline/:id', function (req, res) {
  if (req.session.oauth !== undefined && req.session.oauth.screen_name !== undefined) {
    var apicall = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + req.params.id;
    console.log('API call: ' + apicall);
    var oauth = {
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        token: req.session.oauth.access_token,
        token_secret: req.session.oauth.access_token_secret
    };
    //console.log('oauth used for call: ' + JSON.stringify(oauth));
    request.get({
        url: apicall,
        oauth: oauth,
        json: true
    }, function(error, response, body) {
        if (error) {
            console.log('Uh oh. An error! : ' + error);
        } else {
          console.log('JSON returned from Twitter: ');
          utils.ppJSON(body);
          var tweets = body;
          res.render('timeline', { title: '@' + req.params.id + '\'s Timeline', tweets: tweets, screen_name: req.params.id});
        }
    });
  } else {
      //Not authorized, so send to root for authorization
      res.redirect('/');
  }
});

app.get('/tweetmap/:id', function (req, res) {
  if (req.session.oauth !== undefined && req.session.oauth.screen_name !== undefined) {
    var apicall = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + req.params.id;
    console.log('API call: ' + apicall);
    var oauth = {
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        token: req.session.oauth.access_token,
        token_secret: req.session.oauth.access_token_secret
    };
    //console.log('oauth used for call: ' + JSON.stringify(oauth));
    request.get({
        url: apicall,
        oauth: oauth,
        json: true
    }, function(error, response, body) {
        if (error) {
            console.log('Uh oh. An error! : ' + error);
        } else {
          console.log('JSON returned from Twitter: ');
          utils.ppJSON(body);
          var tweets = body;
          var coords = new Array();
          var messages = new Array();
          for (tweet in tweets) {
            if (tweets[tweet].place){
              //Keep in mind that these coordinates are 'backwards'. The Twitter API sends long, lat instead of lat, long. 
              coords.push(tweets[tweet].place.bounding_box.coordinates[0][0]);
              messages.push(tweets[tweet].text);
            }
          }
          var locations = {coordinates:coords, messages:messages};
          console.log(locations);
          res.render('tweetmap', { title: 'Tweetmap', tweets: tweets, screen_name: req.params.id, locations: JSON.stringify(locations) });
        }
    });
  } else {
      //Not authorized, so send to root for authorization
      res.redirect('/');
  }
});



app.listen(process.env.PORT || config.port);
console.log('Server started on port ' + config.port);
