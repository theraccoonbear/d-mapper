var mapper = {
	HORIZ: 1,
	VERT: 2,
	
	map: {},
	o: {},
	
	paper: null,
	$paper: null,
	
	overlay: null,
	$overlay: null,
	
	didInit: false,
	
	data: {
		rooms: [],
		doors: []
	},
	gridSize: 16,
	width: 0,
	height: 0,
	
	serialize: function() {
		return JSON.stringify(this.data);
	},
	
	clear: function() {
		var paperDom = this.paper.canvas;
    paperDom.parentNode.removeChild(paperDom);
		
		var overlayDom = this.ovelay.canvas;
    overlayDom.parentNode.removeChild(overlayDom);
	},
	
	init: function(options) {
		var o = {
			base: '#baseLayer',
			overlay: '#overlayLayer'
		}
		
		$.extend(o, options);
		
		this.$paper = $(o.base);
		this.$overlay = $(o.overlay);
		
		this.width = this.$paper.width();
		this.height = this.$paper.height();
		
		
		this.paper = new Raphael(this.$paper.get(0), this.width, this.height);
		this.overlay  = new Raphael(this.$overlay.get(0), this.width, this.height);
		this.paper.rect(0, 0, this.width, this.height).attr({fill: '#000'});
		this.didInit = true;
	},
	
	loadMap: function(options) {
		mapper.init();
		mapper.o = $.extend(options, defaults);
		console.log(mapper.o);
	},
	
	saveRoom: function(opt, svg) {
		var o = {
			'opt': opt,
			//'svg': svg,
			'visible': false
		}
		
		this.data.rooms.push(o);
		
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

		room.type = 'rectangle';
		//this.data.rooms.push(rectangle);
		this.saveRoom(room, rectangle);
	},
	
	drawRoundRoom: function(room) {
		var x = room.x * this.gridSize;
		var y = room.y * this.gridSize;
		var radius = room.r * this.gridSize;
		room.type = 'circle';
		
		var circle = this.paper.circle(x, y, radius); 
		circle.attr({
			        'fill': "url('img/large-grid.png')",
			'stroke-width': 0
		});
		
		this.saveRoom(room, circle);
		//this.data.rooms.push(circle);
	},
	
	drawDoor: function(door) {
		var gs = this.gridSize;
		
		var x = door.x * gs;
		var y = door.y * gs;
		var orient = door.orient;
		var block = null;
		
		if (orient == this.VERT) {
			block = this.overlay.rect(x + -1, y + 4, 3, gs - 7);
		} else {
			block = this.overlay.rect(x + 4, y - 1, gs - 7, 3);
		}
		
		block.attr({
			'fill': '#fff',
			'stroke-width': 1,
			'stroke': '#000'
		});
		
		this.data.doors.push(door); //(block);
	},
	
	pixelToGrid: function(v) {
		return Math.round(v / this.gridSize);
	},
	
	snapPixel: function(p) {
		return this.pixelToGrid(p) * this.gridSize;
	},
	
	saveLocal: function(o) {
		var mapName = o.name;
		if (/^[A-Za-z0-9-]+$/.test(mapName)) {
			if (typeof localStorage['d-mapper'] === 'undefined') { localStorage['d-mapper'] = '{}'; }
			
			var cs = false;
			try {
				cs = JSON.parse(localStorage['d-mapper']);
			} catch (e) {
				cs = false;
			}
			
			if (cs === false) { cs = {}; }
			
			if (typeof cs.maps === 'undefined') { cs.maps = {}; }
			cs.maps[mapName] = mapper.data; //.serialize();
			localStorage['d-mapper'] = JSON.stringify(cs);
			return true;
		} else {
			return false;
		}
	},
	
	loadLocal: function(o) {
		var mapName = o.name;
		if (/^[A-Za-z0-9-]+$/.test(mapName)) {
			if (typeof localStorage['d-mapper'] === 'undefined') {
				return false;
			}
			
			var cs = false;
			try {
				cs = JSON.parse(localStorage['d-mapper']);
			} catch (e) {
				return false;
			}
			
			
			if (typeof cs.maps === 'undefined') {
				return false;	
			}
			
			if (typeof cs.maps[mapName] === 'undefined') {
				return false;
			}
			
			mapper.data.rooms = [];
			mapper.data.doors = [];
			
			var mapData = cs.maps[mapName];
			//console.log(mapData);
			
			for (var idx in mapData.rooms) {
				this.drawRectRoom(mapData.rooms[idx].opt);
			}
			
			for (var idx in mapData.doors) {
				this.drawDoor(mapData.doors[idx]);
			}
			
			//cs.maps[mapName] = mapper.data; //.serialize();
			//localStorage['d-mapper'] = JSON.stringify(cs);
			return true;
		} else {
			return false;
		}
	}
	
};