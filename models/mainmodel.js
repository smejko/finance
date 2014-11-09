var wget = require('request');
var $ = require('jquery');

var d1, d2; 

exports.getSummaryData = function(callback) {

	d1 = new $.Deferred();
	d2 = new $.Deferred();

	var result = [];

	getREM();
	getMinera();

	$.when(d1, d2).done(function(rem, minera) {
		result.push(rem);
		result.push(minera);
		callback(result);
	});
};

getMinera = function() {
	var url = "http://www.minerairl.mwnewsroom.com";

	var result = {
		"Company" : "Minera",
		"Headlines" : []
	};	

	wget(url, function(err, res, body) {

		var $items = $(body).find('table table tr');
		$items.each(function(i){
			var $item = $(this);
			var href = $item.find('a').first().attr('href');
			var dateTitle = $item.find('font font').text();
			var date = dateTitle.match(/\S+\s+\S+,\s+\d{4}/);
			var title = dateTitle.replace(/\S+\s+\S+,\s+\d{4}\s+/, "");
			var headline = {
				"Title" : title,
				"Date" : date,
				"Link" : href
			};
			result.Headlines.push(headline);

			if(i === 3) return false;
		})
		d2.resolve(result);
	});
};

getREM = function() {
	var baseUrl = 'http://www.rareearthmineralsplc.com';
	var url = baseUrl + '/news';

	var result = {
		"Company" : "REM",
		"Headlines" : []
	};		

	wget(url, function(err, res, body){

		var $items = $(body).find('div.rns-news-class h4');
		$items.each(function(i){
			var $item = $(this);
			var $dl = $item.next('p.rnsp');
			var date = $dl.text().match(/\d+\s+\w+\s+\d+/);
			var headline = {
				"Title" : $item.text(),
				"Date" : date,
				"Link" : baseUrl + $dl.find('a').attr('href')
			};
			result.Headlines.push(headline);
			// Only show top few
			if(i === 3) return false;
		});
		d1.resolve(result);
	});
};
