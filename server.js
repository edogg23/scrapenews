var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');

console.log('getting articles');
request("https://www.reuters.com/", function(error, response, html) {
	var $ = cheerio.load(html);
	var results = [];

	console.log('scraping still.....')

	$("h3.story-title").each(function(i, element) {
		var title = $(element).text();
		var link = $(element).parent().attr("href");

		results.push({
			title: title,
			link: link
		});
	});
	console.log(results);
});