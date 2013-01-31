var mapper = {
	HORIZ: 1,
	VERT: 2,
	
	map: {},
	o: {},
	
	roomLayer: null,
	$roomLayer: null,
	
	wallLayer: null,
	$wallLayer: null,
	
	topLayer: null,
	$topLayer: null,
	
	$paper: {},
	paper: {},
	
	layers: {
		rooms: {},
		walls: {},
		decorations: {}
	},
	
	didInit: false,
	
	data: {
		rooms: [],
		doors: [],
		walls: [],
		decorations: [],
		moveable: [],
		meta: {}
	},
	
	saved: true,
	
	gridSize: 16,
	width: 0,
	height: 0,
	
	outOfDate: function() {
		this.saved = false;
	},
	
	serialize: function() {
		return JSON.stringify(this.data);
	},
	
	clear: function() {
		this.$paper.html('');
		//this.$roomLayer.html('');
		//this.$wallLayer.html('');
		//this.$topLayer.html('');
		
		//this.width = this.$roomLayer.width();
		//this.height = this.$roomLayer.height();
		this.width = this.$paper.width();
		this.height = this.$paper.height();
		
		//this.roomLayer = new Raphael(this.$roomLayer.get(0), this.width, this.height);
		//this.wallLayer = new Raphael(this.$wallLayer.get(0), this.width, this.height);
		//this.topLayer  = new Raphael(this.$topLayer.get(0), this.width, this.height);
		//this.roomLayer.rect(0, 0, this.width, this.height).attr({fill: '#000'});
		
		this.paper = new Raphael(this.$paper.get(0), this.width, this.height);
		this.layers.rooms = this.paper.set();
		this.layers.walls = this.paper.set();
		this.layers.decorations = this.paper.set();
		
		var bg = this.paper.rect(0, 0, this.width, this.height).attr({fill: '#000'});
		this.layers.rooms.push(bg);
		
		
		mapper.data.rooms = [];
		mapper.data.doors = [];
		mapper.data.walls = [];
		mapper.data.decorations = [];
		mapper.data.moveable = [];
		mapper.data.meta = {};
		
	},
	
	init: function(options) {
		var o = {
			paper: '#paper',
			base: '#baseLayer',
			wallLayer: '#wallLayer',
			topLayer: '#topLayer',
		}
		
		$.extend(o, options);
		
		this.$paper = $(o.paper);
		
		//this.$roomLayer = $(o.base);
		//this.$wallLayer = $(o.wallLayer);
		//this.$topLayer = $(o.topLayer);
		
		this.clear();
		
		this.didInit = true;
	},

	
	saveRoom: function(opt, svg) {
		var o = {
			'opt': opt,
			'visible': false
		}
		
		this.data.rooms.push(o);
		return o;
	},
	
	drawStairs: function(room) {
		var x = room.x * this.gridSize;
		var y = room.y * this.gridSize;
		var width = (room.w * this.gridSize) + 1;
		var height = (room.h * this.gridSize) + 1;
		room.orient = room.orient == mapper.VERT ? mapper.VERT : mapper.HORIZ;
		
		var fill = room.orient == mapper.VERT ? 'vert' : 'horiz';
		
		room.type = 'stairs';
		
		//var rectangle = this.roomLayer.rect(x, y, width, height);
		var rectangle = this.paper.rect(x, y, width, height);
		this.layers.rooms.push(rectangle);
		rectangle.attr({
			        'fill': "url('img/" + fill + "-stairs.png')",
			'stroke-width': 0
		});
		this.outOfDate();
		this.saveRoom(room, rectangle);
	},
	
	drawRectRoom: function(room) {
		
		var x = room.x * this.gridSize;
		var y = room.y * this.gridSize;
		var width = (room.w * this.gridSize) + 1;
		var height = (room.h * this.gridSize) + 1;
		room.type = 'rectangle';
		
		//var rectangle = this.roomLayer.rect(x, y, width, height);
		var rectangle = this.paper.rect(x, y, width, height);
		this.layers.rooms.push(rectangle);
		rectangle.attr({
			        'fill': "url('img/large-grid.png')",
			'stroke-width': 0
		});
		this.outOfDate();
		this.saveRoom(room, rectangle);
	},
	
	drawRectWall: function(wall) {
		
		var x = wall.x * this.gridSize;
		var y = wall.y * this.gridSize;
		var width = (wall.w * this.gridSize) + 1;
		var height = (wall.h * this.gridSize) + 1;
		wall.type = 'rectangle';
		
		//x += 1;
		//y += 1;
		//width -= 2;
		//height -= 2;
		
		//var rectangle = this.wallLayer.rect(x, y, width, height);
		var rectangle = this.paper.rect(x, y, width, height);
		this.layers.walls.push(rectangle);
		rectangle.attr({
			        'fill': "#000",
			'stroke-width': 1,
						'stroke': '#000'
		});
		this.outOfDate();
		this.data.walls.push(wall)
	},
	
	
	drawRoundRoom: function(room) {
		var rx = (typeof room.r === 'undefined' ? (room.w / 2) : room.r) * this.gridSize;
		var ry = (typeof room.r === 'undefined' ? (room.h / 2) : room.r) * this.gridSize;
		
		var x = (room.x * this.gridSize) + rx;
		var y = (room.y * this.gridSize) + ry;
		
		room.type = 'ellipse';
		
		//var ellipse = this.roomLayer.ellipse(x, y, rx, ry)
		var ellipse = this.paper.ellipse(x, y, rx, ry)
		this.layers.rooms.push(ellipse);
		ellipse.attr({
			        'fill': "url('img/large-grid.png')",
			'stroke-width': 0
		});
		this.outOfDate();
		this.saveRoom(room, ellipse);
	},
	
	drawRoundWall: function(wall) {
		var rx = (typeof wall.r === 'undefined' ? (wall.w / 2) : room.r) * this.gridSize;
		var ry = (typeof wall.r === 'undefined' ? (wall.h / 2) : room.r) * this.gridSize;
		
		rx -= 2;
		ry -= 2;
		
		var x = (wall.x * this.gridSize) + rx;
		var y = (wall.y * this.gridSize) + ry;
		
		wall.type = 'ellipse';
		
		//var ellipse = this.wallLayer.ellipse(x, y, rx, ry)
		var ellipse = this.paper.ellipse(x, y, rx, ry)
		this.layers.walls.push(ellipse);
		ellipse.attr({
			        'fill': "#000",
			'stroke-width': 1,
						'stroke': '#000'
		});
		this.outOfDate();
		this.data.walls.push(wall);
	},
	
	drawDoor: function(door) {
		var gs = this.gridSize;
		
		var x = door.x * gs;
		var y = door.y * gs;
		var orient = door.orient;
		var block = null;
		
		if (orient == this.VERT) {
			//block = this.topLayer.rect(x + -1, y + 4, 3, gs - 7);
			block = this.paper.rect(x + -1, y + 4, 3, gs - 7);
		} else {
			//block = this.topLayer.rect(x + 4, y - 1, gs - 7, 3);
			block = this.paper.rect(x + 4, y - 1, gs - 7, 3);
		}
		
		this.layers.decorations.push(block);
		
		block.attr({
			'fill': '#fff',
			'stroke-width': 1,
			'stroke': '#000'
		});
		
		this.outOfDate();
		this.data.doors.push(door); //(block);
	},
	
	drawColumn: function(col) {
		var gs = this.gridSize;
		
		var r = Math.round(gs / 2);
		var x = (col.x * gs) + r;
		var y = (col.y * gs) + r;
		
		
		//var circle = this.topLayer.circle(x, y, r - 4);
		var circle = this.paper.circle(x, y, r - 4);
		this.layers.decorations.push(circle);
		circle.attr({
			        'fill': "#666",
			'stroke-width': 1,
					  'stroke': '#000'
		});
		
		this.outOfDate();
		this.data.decorations.push(col); //(block);
	},
	
	drawDecoration: function(dec) {
		switch (dec.type) {
			case 'column':
				this.drawColumn(dec);
				break;
			default:
				console.log('Unknown decoration type: ' + dec.type);
		}
	},
	
	
	drawPlayer: function(mov) {
		mov.type = 'player';
		this.drawMoveable(mov);
	},
	
	drawMonster: function(mov) {
		mov.type = 'monster';
		this.drawMoveable(mov);
	},
	
	drawMoveable: function(mov) {
		
		var gs = this.gridSize;
		
		var x = mov.x * gs;
		var y = mov.y * gs;
		
		//var rectangle = this.topLayer.rect(x, y, 16, 16);
		var rectangle = this.paper.rect(x, y, 16, 16);
		this.layers.decorations.push(rectangle);
		rectangle.attr({
			        'fill': "url('img/moveable-" + mov.type + ".png')",
			'stroke-width': 0
		});
		this.outOfDate();
		this.data.moveable.push(mov);
	},
	
	gridToPixel: function(g) {
		return g * this.gridSize;
	},
	
	pixelToGrid: function(v) {
		return Math.round(v / this.gridSize);
	},
	
	snapPixel: function(p) {
		return this.pixelToGrid(p) * this.gridSize;
	},
	
	saveRemote: function(m) {
		m = typeof m == 'undefined' ? mapper.data : m;
		
		$.ajax('/upload.php', {
			method: 'POST',
			data: {
				map: m
			},
			success: function(data, status, xhr) {
				console.log("Success!");
				console.log(data);
			}
		});
	},
	
	saveLocal: function(o) {
		var mapName = o.name;
		if (/^[A-Za-z0-9-]+$/.test(mapName) || true) {
			if (typeof localStorage['d-mapper'] === 'undefined') { localStorage['d-mapper'] = '{}'; }
			
			var cs = false;
			try {
				cs = JSON.parse(localStorage['d-mapper']);
			} catch (e) {
				cs = false;
			}
			
			if (cs === false) { cs = {}; }
			
			if (typeof cs.maps === 'undefined') { cs.maps = {}; }
			
			mapper.data.meta['name'] = mapName;
			mapper.saved = true;
			cs.maps[mapName] = mapper.data; //.serialize();
			localStorage['d-mapper'] = JSON.stringify(cs);
			return true;
		} else {
			return false;
		}
	},
	
	
	loadLocal: function(o) {
		var mapName = o.name;
		if (/^[A-Za-z0-9-]+$/.test(mapName) || true) {
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
			
			this.clear();
			
			var mapData = cs.maps[mapName];
			//console.log(mapData);
			
			for (var idx in mapData.rooms) {
				var room = mapData.rooms[idx].opt;
				if (room.type == 'ellipse') {
					this.drawRoundRoom(room);
				} else if (room.type == 'stairs') {
					this.drawStairs(room);
				} else {
					this.drawRectRoom(room);
				}
			}
			
			for (var idx in mapData.walls) {
				if (mapData.walls[idx].type == 'ellipse') {
					this.drawRoundWall(mapData.walls[idx]);
				} else {
					this.drawRectWall(mapData.walls[idx]);
				}
			}
			
			for (var idx in mapData.doors) {
				this.drawDoor(mapData.doors[idx]);
			}
			
			for (var idx in mapData.decorations) {
				this.drawDecoration(mapData.decorations[idx]);
			}
			
			for (var idx in mapData.moveable) {
				this.drawMoveable(mapData.moveable[idx]);
			}
			
			this.saved = true;
			
			//cs.maps[mapName] = mapper.data; //.serialize();
			//localStorage['d-mapper'] = JSON.stringify(cs);
			return true;
		} else {
			return false;
		}
	},
	
	listMaps: function() {
		if (typeof localStorage['d-mapper'] === 'undefined') {
			return [];
		}
		
		var cs = false;
		try {
			cs = JSON.parse(localStorage['d-mapper']);
		} catch (e) {
			return [];
		}
		
		
		if (typeof cs.maps === 'undefined') {
			return [];	
		}
		
		var ml = [];
		for (var mapName in cs.maps) {
			console.log(mapName);
			ml.push(mapName);
		}
		
		return cs.maps;
		//
		//return ml;
	}
	
};