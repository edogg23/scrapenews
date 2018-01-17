var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');
var mongojs = require('mongojs');

var app = express();
var PORT = 3000;
var databaseURL = "news";
var collections = ["newsdata"];

var db = mongojs(databaseURL, collections);
db.on('connect', function() {
	console.log("news database is connected");
})
db.on("error", function() {
	console.log("database error: ", error);
});

app.get("/", function(req, res) {
	res.send("Welcome to News");
});

app.get("/scrape", function(req, res) {
	request("https://www.reuters.com/",function(error, response, html) {
		var $ = cheerio.load(html);

		$("h3.story-title").each(function(i, element) {
			var title = $(element).text();
			var link = $(element).parent().attr("href");

			if (title && link) {
				db.newsdata.insert({
					title: title,
					link: link			
				}, function(err, inserted){
					if (err) {
						console.log(err);
					}
					else {
						console.log("inserted", inserted);
					}
				});
			}
	   });
		res.send("Scrap Done");
	});
});




// console.log('getting articles');
// request("https://www.reuters.com/", function(error, response, html) {
// 	var $ = cheerio.load(html);
// 	var results = [];
// 	var sresults = [];

// 	console.log('scraping still.....')

// 	$(".story-content").each(function(i, element) {
// 		var summary = $(element).find("p").text();
// 		sresults.push({
// 			summary: summary
// 		});
// 		console.log(sresults);
// 	});

// 	$("h3.story-title").each(function(i, element) {
// 		var title = $(element).text();
// 		var link = $(element).parent().attr("href");


// 		results.push({
// 			title: title,
// 			link: link
// 		});
// 	});
// 	console.log(results);
// });

app.listen(PORT, function() {
	console.log("listening on port: " + PORT );
});

console.log("end program");