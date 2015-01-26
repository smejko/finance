var express = require('express');
var path = require('path');
var debug = require('debug')('finance');
var logger = require('morgan');

var index = require('./routes/index.js');

var app = express();

// Handlebars view engine
var handlebars = require('express-handlebars')
	.create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(logger('common'));
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.get('/', index);

app.get('/favicon.ico', function(req, res) {
	res.sendFile(path.join(__dirname, '/favicon.ico'));
});

app.get('/about', function(req, res) {
	res.render('about', { date: new Date() });
});

// Error handling
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// Start service
app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), function() {
	debug('Express started on http://localhost:' + 
		app.get('port') + '; press Ctrl-C to terminate.');
});