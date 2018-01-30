// required dependencies 
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');
var mongojs = require('mongojs');
var logger = require('morgan');

var app = express();
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({
		extended: false
	}))

// var PORT = 3000;
var port = process.env.PORT || 3000;

// set up Express-Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var databaseURL = "news";
var collections = ["newsdata"];

// connect to mongodb
var db = mongojs(databaseURL, collections);
db.on('connect', function() {
	console.log("news database is connected");
})
db.on("error", function() {
	console.log("database error: ", error);
});

// set routes

app.get("/", function(req, res) {
	res.send("Welcome to News");
});

// this route scrapes the site and puts the title and links in the database
app.get("/scrape", function(req, res) {
	console.log('getting articles......')
	request("https://www.reuters.com/",function(error, response, html) {
		var $ = cheerio.load(html);
      console.log('getting title and link............')
		$("h3.story-title").each(function(i, element) {
			var title = $(element).text();
			var link = $(element).parent().attr("href");
		console.log('inserting into database......')
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
		console.log('done scraping........')
	});
});



// This code scrapes the site correctly but doesn't insert into database
// console.log('getting articles');
// request("https://www.reuters.com/", function(error, response, html) {
// 	var $ = cheerio.load(html);
// 	var results = [];
// 	var sresults = [];

// 	console.log('scraping still.....');

// 	$(".story-content").each(function(i, element) {
// 		var summary = $(element).find("p").text();
// 		sresults.push({
// 			summary: summary
// 		});
// 		console.log(sresults);
// 	});

// 	console.log('getting title.......');

// 	$("h3.story-title").each(function(i, element) {
// 		var title = $(element).text();
// 		var link = $(element).parent().attr("href");


// 		results.push({
// 			title: title,
// 			link: link
// 		});
// 	});
// 	console.log(results);
// 	console.log('done scraping....')
// });

app.listen(port, function() {
	console.log("listening on port: " + port );
});

console.log("end program");