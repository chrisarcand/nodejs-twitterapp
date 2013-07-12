var http = require("http")
  , express = require("express")
  , OAuth= require('oauth').OAuth
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
});

/* ROUTES */
app.get('/', routes.index);




app.listen(config.port);
console.log('Server started on port ' + config.port);


/*var oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  keys.consumer_key,
  keys.consumer_secret,
  '1.0A',
  'http://localhost:8888/oauth/callback',
  'HMAC-SHA1'
);

oauth.get(
  'https://api.twitter.com/1.1/statuses/home_timeline.json',
  keys.access_token, 
  keys.token_secret,             
  function (e, data, res){
    if (e) console.error(e);        
    logAsJSON(data);    
  }
*/