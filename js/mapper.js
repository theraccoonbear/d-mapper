var mapper = {
	HORIZ: 1,
	VERT: 2,
	
	map: {},
	o: {},
	
	paper: null,
	$paper: null,
	rooms: [],
	doors: [],
	gridSize: 16,
	width: 0,
	height: 0,
	
	
	init: function(options) {
		var o = {
			paperSelector: '#raphael'
		}
		
		$.extend(o, options);
		
		this.$paper = $(o.paperSelector);
		this.width = this.$paper.width();
		this.height = this.$paper.height();
		
		
		this.paper = new Raphael(this.$paper.get(0), this.width, this.height);
		this.paper.rect(0, 0, this.width, this.height).attr({fill: '#000'});
		//var circle = paper.circle(100, 100, 80); 
	},
	
	loadMap: function(options) {
		mapper.init();
		mapper.o = $.extend(options, defaults);
		console.log(mapper.o);
	},
	
	saveRoom: function(opt, svg) {
		var o = {
			'opt': opt,
			'svg': svg,
			'visible': false
		}
		
		this.rooms.push(o);
		
		return o;
	},
	
	drawRectRoom: function(room) {
		
		var x = room.x * this.gridSize;
		var y = room.y * this.gridSize;
		var width = (room.w * this.gridSize) + 1;
		var height = (room.h * this.gridSize) + 1;
		
		var rectangle = this.paper.rect(x, y, width, height);
		rectangle.attr({
			        'fill': "url('img/large-grid.png')",
			'stroke-width': 0
		});

		this.rooms.push(rectangle);
	},
	
	drawRoundRoom: function(room) {
		var x = room.x * this.gridSize;
		var y = room.y * this.gridSize;
		var radius = room.r * this.gridSize;
		
		var circle = this.paper.circle(x, y, radius); 
		circle.attr({
			        'fill': "url('img/large-grid.png')",
			'stroke-width': 0
		});
		
		this.rooms.push(circle);
	},
	
	drawDoor: function(door) {
		var gs = this.gridSize;
		
		var x = door.x * gs;
		var y = door.y * gs;
		var orient = door.orient;
		var block = null;
		
		if (orient == this.VERT) {
			block = this.paper.rect(x + -1, y + 4, 3, gs - 7);
		} else {
			block = this.paper.rect(x + 4, y - 1, gs - 7, 3);
		}
		
		block.attr({
			'fill': '#fff',
			'stroke-width': 1,
			'stroke': '#000'
		});
		
		this.doors.push(block);
	},
	
	pixelToGrid: function(v) {
		return Math.round(v / this.gridSize);
	},
	
	snapPixel: function(p) {
		return (Math.round(p / this.gridSize) * this.gridSize);
	}
	
};