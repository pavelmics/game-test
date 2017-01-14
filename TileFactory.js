/**
 * Abstract tile
 * @constructor
 */
function AbstractTile() {}
AbstractTile.prototype = {
    draw: OOPHelper.mustBeOverloaded
};

/**
 * Colored tile
 * @param color
 * @constructor
 */
function ColoredTile(color) {
    this.color = color;
}
ColoredTile.prototype = Object.create(AbstractTile.prototype);
ColoredTile.prototype.draw = function(canvas2d, tile, x, y, w, h, gameTime) {
    canvas2d.beginPath();
    canvas2d.rect(x, y, w, h);
    canvas2d.fillStyle = tile.getColor();
    canvas2d.fill();
};
ColoredTile.prototype.getColor = function() {
    return this.color;
};

/**
 * Empty tile
 * @constructor
 */
function EmptyTile() {
    ColoredTile.apply(this, ['black']);
}
EmptyTile.prototype = Object.create(ColoredTile.prototype);
EmptyTile.prototype.constructor = EmptyTile;

/**
 *
 * @constructor
 */
function RedTile() {
    ColoredTile.apply(this, ['red']);
}
RedTile.prototype = Object.create(ColoredTile.prototype);
RedTile.prototype.constructor = RedTile;


/**
 *
 * @param start
 * @param end
 * @param timeout
 * @constructor
 */
function BlinkTile(start, end, timeout) {
    var self = this;
    this.colors = this.generateGradientColors(start, end);
    this.offset = 0;
    this.currentColor = this.colors[this.offset];
    this.isPlus = true;

    this.changeColorTimeout = TimeHelper.createInterval(timeout, 0, function() {
        if (self.isPlus && 'undefined' === typeof self.colors[self.offset + 1]) {
            self.isPlus = false;
        }
        if ((!self.isPlus) && 'undefined' === typeof self.colors[self.offset - 1]) {
            self.isPlus = true;
        }

        self.isPlus
            ? self.offset += 1
            : self.offset -= 1;
        self.currentColor = self.colors[self.offset];
    });
}
BlinkTile.prototype = Object.create(AbstractTile);
BlinkTile.prototype.draw = function(canvas2d, tile, x, y, w, h, gameTime) {
    this.changeColorTimeout(gameTime);
    canvas2d.beginPath();
    canvas2d.rect(x, y, w, h);
    canvas2d.fillStyle = this.currentColor;
    canvas2d.fill();
};
BlinkTile.prototype.interpolate = function (start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);

    return Math.floor(final);
};
BlinkTile.prototype.generateGradientColors = function(start, end) {
    var total = 25;
    var result = [];
    var r;
    var g;
    var b;

    for (var i = 0; i !== total; i++) {
        r = this.interpolate(start.r, end.r, total, i);
        g = this.interpolate(start.g, end.g, total, i);
        b = this.interpolate(start.b, end.b, total, i);
        result.push(this.rgb2hex(r, g, b));
    }

    return result;
};
BlinkTile.prototype.rgb2hex = function(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
};