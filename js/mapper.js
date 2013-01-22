var mapper = {
	map: {},
	o: {},
	
	init: function() {
	
	},
	
	loadMap: function(options) {
		mapper.init();
		mapper.o = $.extend(options, defaults);
		console.log(mapper.o);
	}
};