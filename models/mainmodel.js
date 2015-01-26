var wget = require('request');
var utils = require('../lib/utils.js')
var $ = require('jquery');

var timeout = 10000;

var d1, d2, d3, d4; 

exports.getSummaryData = function(callback) {

	d1 = new $.Deferred();
	d2 = new $.Deferred();
	d3 = new $.Deferred();
	d4 = new $.Deferred();

	var result = [];

	getREM();
	getMinera();
	getIGas();
	getFresnillo();

	$.when(d1, d2, d3, d4).done(function(rem, minera, igas, fresnillo) {
		result.push(rem);
		result.push(minera);
		result.push(igas);
		result.push(fresnillo);
		callback(result);
	});
};

getFresnillo = function() {
	var baseUrl = "http://otp.investis.com/clients/uk/fresnillo1/rns/";
	var url = baseUrl + "regulatory-news.aspx";

	var result = {
		"Company" : "Fresnillo",
		"Headlines" : []
	};	

	wget({ url: url, timeout: timeout }, function(err, res, body) {
		if(!err) {
			var $items = $(body).find('.RowStyle');
			$items.each(function(i){
				var $item = $(this);
				var $titleElem = $item.find('.titlerow').not('.for320').find('a');
				var href = baseUrl + $titleElem.attr('href');
				var title = $titleElem.text();
				var date = $item.find('.daterow').not('.for320').find('span').text();
				var headline = {
					"Title" : title,
					"Date" : date.toShortDateString(),
					"Link" : href
				};
				result.Headlines.push(headline);

				if(i === 3) return false;
			})
		} else {
			result.Error = err;
		}
		d4.resolve(result);
	});
};

getMinera = function() {
	var url = "http://www.minerairl.mwnewsroom.com";

	var result = {
		"Company" : "Minera",
		"Headlines" : []
	};	

	wget({ url: url, timeout: timeout }, function(err, res, body) {
		if(!err) {
			var $items = $(body).find('table table tr');
			$items.each(function(i){
				var $item = $(this);
				var href = url + $item.find('a').first().attr('href');
				var dateTitle = $item.find('font font').text();
				var date = dateTitle.match(/\S+\s+\S+,\s+\d{4}/);
				var title = dateTitle.replace(/\S+\s+\S+,\s+\d{4}\s+/, "");
				var headline = {
					"Title" : title,
					"Date" : date[0].toShortDateString(),
					"Link" : href
				};
				result.Headlines.push(headline);

				if(i === 3) return false;
			})
		} else {
			result.Error = err;
		}
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

	wget({ url: url, timeout: timeout }, function(err, res, body){
		if(!err) {
			var $items = $(body).find('div.rns-news-class h4');
			$items.each(function(i){
				var $item = $(this);
				var $dl = $item.next('p.rnsp');
				var date = $dl.text().match(/\d+\s+\w+\s+\d+/);
				var headline = {
					"Title" : $item.text(),
					"Date" : date[0].toShortDateString(),
					"Link" : baseUrl + $dl.find('a').attr('href')
				};
				result.Headlines.push(headline);
				// Only show top few
				if(i === 3) return false;
			});
		} else {
			result.Error = err;
		}
		d1.resolve(result);
	});
};

getIGas = function() {
	var url = 'http://www.igasplc.com/investors';

	var result = {
		"Company" : "IGas Energy",
		"Headlines" : []
	};		

	wget({ url: url, timeout: timeout }, function(err, res, body) {
		if(!err) {
			var $items = $(body).find('ul.news-list li');
			$items.each(function(i){
				var $item = $(this);
				var dateString = $item.find('.date').text();
				var date = dateString.replace(/(..)\/(..)\/(...)/, '$2/$1/$3');
				var headline = {
					"Title" : $item.find('a').text(),
					"Date" : date.toShortDateString(),
					"Link" : $item.find('a').attr('href')
				};
				result.Headlines.push(headline);
				// Only show top few
				if(i === 3) return false;
			});
		} else {
			result.Error = err;
		}
		d3.resolve(result);
	});
};