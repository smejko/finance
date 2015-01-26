String.prototype.toShortDateString = function() {
	var date = new Date(this);
	return date.toDateString().substr(4);
};

module.exports = {

	toShortDateString: function(dateString) {
		var date = new Date(dateString);
		return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	},
	sayHello: function() {
		return "Hello";
	}
}