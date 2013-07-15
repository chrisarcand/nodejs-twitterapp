nodejs-twitterapp
=================

A very simplistic Node.js app for interacting with the Twitter and Google Maps API's, deployed on Heroku

###Deployment

Deployed to Heroku at [http://pure-savannah-7218.herokuapp.com/](http://pure-savannah-7218.herokuapp.com/)

If you want to test locally, just clone the repository, run <code>npm install</code> to install dependencies from package.json, and one more final step: You *must* change the callback URL in app.js for Twitter back to <code>localhost:5000</code>. An easy switch for production/development instances will be added in the future, but it is a quick change to have it deployed now. (AKA: Don't bother, just visit Heroku!)

###Behavior
The app signs in with Twitter's OAuth authentication and provides you with a screen to search for keywords using Twitter's GET search/tweets. You may click any of the Tweeter's usernames to be brought to another screen with tweets from their timeline. You may also map the tweets on a Google Map to see where they tweeted from (clicking on the pins returns the tweet text). 

###Technical notes
**Important:** The Google Maps functionality uses Twitter's polygonal GPS coordinates. These coordinates are separate from the coordinates returned for using the GPS tracker in mobile devices to your exact location. I did this because it was much easier to create dummy data to demonstrate the behavior than running around town (I honestly don't know of many people at all that actually use the Location Services on their Twitter Apps constantly, let alone in varying places!). This polygonal coordinates are what are used when you enter a city or area in the Twitter website when you want to tell your location without using Location Services. **Search for 'fakechrisarcand', a dummy Twitter account I set up, which demonstrates these city-based tweet locations**

 

###Future considerations
This app was put together in about two days, and as such, it has some things that could be improved on. Some of the major considerations: 

* I really dislike all of the request handlers are contained within the main server file (shudder). The server file should contain one line routes to separate request handlers to make the app *much* more modular and organized. However, I had a bit of trouble trying to get the proper definitions and modules into the separate routing files. Because of time constraints I decided it was wiser to keep it simple and handle my requests in this way - and so this would probably be the very first thing I'd change, given proper time.
* Separate production and development environments need to be set up. It wasn't needed throughout development but now that it's deployed to Heroku things need to be set properly (namely, the callback URL for Twitter as above)
* As was talked about above, I can easily add the GPS coordinates to the Tweet Map functionality. (It's actually easier than the polygonal coordinates I've used here)
* I threw in some Bootstrap and a few CSS rules to make the UI usable but it could still use some work. Specifically, given more time I'd like to add AJAX calls to the search function instead of form submission. 
* One of the most time consuming things about this app was (almost embarrassingly) the use of the Jade template engine. I'd never used it before and initially found it difficult to get data to the views in the way I wanted, especially trying to get dynamically generated, literal code to the client-side JavaScript for the Tweet Maps. Given more time, I'd refine the views and the data passing a bit more cleanly. Or just find a Jinja2 -> Node.js port!
* As another side effect of the previous consideration (Using Jade), the Tweet Map functionality is...basic. It does what was asked, but given more time I'd add more interesting data to the windowViews seen when you click on the tweet pins (Tweeter profile picture, date/time, etc, etc.)
* Three words: Test, Driven, and Development. You didn't find any of that here. In a proper project with more than two days to write it, some testing definitely should be added. 
