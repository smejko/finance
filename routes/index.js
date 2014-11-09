var express = require('express');
var router = express.Router();
var model = require('../models/mainmodel')

router.get('/', function(req, res) {
	model.getSummaryData(function(data){
	res.render('home', { model: data });
	});
});

module.exports = router;