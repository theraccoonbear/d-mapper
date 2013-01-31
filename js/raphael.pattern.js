Raphael.fn.stripedRect = function (x1, y1, width, height, options) {
	options = options || {};
	var boxEl = this.rect(x1, y1, width, height);
	boxEl.attr({
		'fill': "#fff",
		'stroke-width': 0
	});
	
	var xShift = options.lineSpacing || 10;
	var angle = options.angle || 45;

	var radians = (90 - angle) * (Math.PI / 180);
	var yShift = xShift / Math.tan(radians);

	var moveX = x1,
		moveY = y1,
		finalX = x1 + width,
		finalY = y1 + height,
		lineX = x1,
		lineY = y1,
		pathString = [];

	while (moveX < finalX) {
		moveX += xShift;
		lineY += yShift;
		if (lineY > finalY) {
			lineX += xShift;
			lineY = finalY;
		}
		if (moveX > finalX) {
			moveY += yShift;
			moveX = finalX;
		}
		pathString = pathString.concat(['M', moveX, moveY, 'L', lineX, lineY]);
	}
	while (moveY < finalY) {
		moveY += yShift;
		lineX += xShift;
		if (lineX > finalX) {
			lineY += yShift;
			lineX = finalX;
		}
		if (lineX > x1 && lineY < finalY) {
			lineY += yShift;
			lineX = x1;
		}
		if (lineY > finalY) {
			lineY = finalY;
		}
		pathString = pathString.concat(['M', moveX, moveY, 'L', lineX, lineY]);
		if (moveY + yShift > finalY) {
			break;
		}
	}
	var stripe = this.path(pathString);

	var collection = this.set();
	collection.push(boxEl, stripe);
	return collection;
};