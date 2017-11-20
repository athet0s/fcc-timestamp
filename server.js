// server.js
// where your node app starts

// init project
var express = require('express');
var qs = require('querystring');
var app = express();

var months = ['January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'];

app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/*", function (req, res) {
  var result = {unix: null,
              natural: null};
  var params = req.originalUrl.slice(1, req.originalUrl.length);
  var paramsIsUnix = false;
  var date = undefined;
  // first check and try to get date from unix timestamp
  if( params.length <= 12 ){
   var regexUnix = new RegExp('\\d{'+ params.length +'}');
    if (regexUnix.test(params)){
      params = parseInt(params);
      date = new Date(params * 1000);
      paramsIsUnix = true;
    }
  }
  //try to get date derectly from params string if its not unix timestamp
  if(!paramsIsUnix){
    params = qs.unescape(params);
    date = new Date(params);
  }
  //if date object is valid fill result object
  if( !isNaN( date.getDate())){
    result.unix = date.getTime() / 1000;
    result.natural = months[date.getMonth()] + ' ' +
                             date.getDate() + ', ' +
                             date.getFullYear();
  }
  
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(result));
  
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});