var Twit = require('twit');
var yahooFinance = require('yahoo-finance');


var T = new Twit({
    consumer_key:         'V4go4l0Y0fksEOkp5Vl4nuSsZ'
  , consumer_secret:      'IY6akJHPfg8HWdy9GzcyrYIQWukV018SP9gD6vOCBKGSgffXTN'
  , access_token:         '278752626-RoFmZgSA2v9l149HgFvvFq1YspQcolKaIt7ZCDWp'
  , access_token_secret:  'VnyzKzMsmMgZtmqGtRMj2HI0aGloJsp76rmAN76TRy2EI'
});

var symbol = '$MBLY';
var fs = require('fs');
var fromDate = '2015-01-01';
var toDate = '2015-05-31';

yahooFinance.historical({
  symbol: symbol.substr(1),
  from: fromDate,
  to: toDate
}, function (err, quotes, url, symbol) {
	fs.writeFile('./quotes.json', JSON.stringify(quotes), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log('quotes.json was saved!');
	}); 
  console.log(quotes);
});


var tweets = {statuses:[]};
var maxId = 0;
var qString = symbol+' since:'+fromDate;
console.log(qString);

function getTweets(maxId){
	T.get('search/tweets', { q: qString, lang: 'en', count: 100, max_id: maxId}, function(err, data, response) {
	    if(!data){
			fs.writeFile('./tweets.json', JSON.stringify(tweets), function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log('tweets.json was saved!');
			}); 	    
		}
	    else{
	    	tweets.statuses.push(data.statuses);
	    	console.log(JSON.stringify(data.statuses));
	    	maxId = data.statuses[0].id;
	    	getTweets(maxId);
	    }
	})
}

T.get('search/tweets', { q: qString, lang: 'en', count: 100}, function(err, data, response) {
	if(data){
		tweets.statuses.push(data.statuses);
	    console.log(JSON.stringify(data.statuses));
		maxId = data.statuses[0].id;
		getTweets(maxId);
	}
	else{
		console.log('No tweet found.');
	}
})