var Twit = require('twit');
var yahooFinance = require('yahoo-finance');
var dateFormat = require('dateformat');


var T = new Twit({
    consumer_key:         'V4go4l0Y0fksEOkp5Vl4nuSsZ'
  , consumer_secret:      'IY6akJHPfg8HWdy9GzcyrYIQWukV018SP9gD6vOCBKGSgffXTN'
  , access_token:         '278752626-RoFmZgSA2v9l149HgFvvFq1YspQcolKaIt7ZCDWp'
  , access_token_secret:  'VnyzKzMsmMgZtmqGtRMj2HI0aGloJsp76rmAN76TRy2EI'
});

var symbol = process.argv[2];
var fs = require('fs');
var curDate = new Date();
curDate.setDate(curDate.getDate()-9);
var fromDate = dateFormat(curDate, 'yyyy-mm-dd');

yahooFinance.historical({
  symbol: symbol.substr(1),
  from: fromDate
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


function printTweet(statuses){
	for(var i = 0; i < statuses.length; i++){
		console.log(statuses[i]['created_at']);
		console.log(statuses[i].text);
		console.log('----------------------');
	}
	console.log('************************');
}

function getTweets(maxId){
	T.get('search/tweets', { q: qString, lang: 'en', count: 100, max_id: maxId}, function(err, data, response) {
	    if(data === undefined || data.statuses.length===0){
			fs.writeFile('./tweets.json', JSON.stringify(tweets), function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log('tweets.json was saved!');
			}); 	    
		}
	    else{
	    	tweets.statuses = tweets.statuses.concat(data.statuses);
	    	printTweet(data.statuses);
	    	maxId = data.statuses[data.statuses.length-1].id;
	    	getTweets(maxId);
	    }
	})
}

T.get('search/tweets', { q: qString, lang: 'en', count: 100}, function(err, data, response) {
	if(data!==undefined && data.statuses.length>0){
		tweets.statuses = tweets.statuses.concat(data.statuses);
	   	printTweet(data.statuses);
		maxId = data.statuses[data.statuses.length-1].id;
		getTweets(maxId);
	}
	else{
		console.log('No tweet found.');
	}
})