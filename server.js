var http = require("http");
var url = require("url");
var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys');

var oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  keys.consumer_key,
  keys.consumer_secret,
  '1.0A',
  'http://localhost:8888/oauth/callback',
  'HMAC-SHA1'
);

function logAsJSON(obj) {
  //For debugging purposes
  //Pretty print a string as JSON to the console
  console.log(JSON.stringify(JSON.parse(obj), null, 4));
}

function start() {
  function onRequest(request, response) {
  	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");

  oauth.get(
    'https://api.twitter.com/1.1/statuses/home_timeline.json',
    keys.access_token, 
    keys.token_secret,             
    function (e, data, res){
      if (e) console.error(e);        
      logAsJSON(data);    
    }
  );
}

exports.start = start;