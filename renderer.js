
function Renderer(canvas2d) {
    this.canvas2d = canvas2d;
    this.map = [];

    // ширина и высота поля в тайлах, считаем от 0
    this.TILE_COUNT_WIDTH  = 20;
    this.TILE_COUNT_HEIGHT = 15;

}
Renderer.prototype = {


    /**
     * Renders the game field
     */
    render: function() {
        var pixelOffsetX = 0;
        var pixelOffsetY = 0;
        var tile;
        var index;

        for (var y = 0; y !== this.TILE_COUNT_HEIGHT; y++) {  // строки тайлов
            for (var x = 0; x !== this.TILE_COUNT_WIDTH; x++) { // ячейки тайлов
                index = (y * this.TILE_COUNT_WIDTH) + x;  // строку умножаем на количество ячеек в строке и добовляем Y
                tile = this.map[index];
                this._drawRectangle(
                    pixelOffsetX,
                    pixelOffsetY,
                    tile.getWidth(),
                    tile.getHeight(),
                    tile.getColor()
                );
                pixelOffsetX = pixelOffsetX + tile.getWidth();
            }

            pixelOffsetY = pixelOffsetY + tile.getHeight();
            pixelOffsetX = 0;
        }
    },

    _drawRectangle: function(x, y, w, h, color) {
        this.canvas2d.beginPath();
        this.canvas2d.rect(x, y, w, h);
        if ('string' === typeof color) {
            this.canvas2d.fillStyle = color;
            this.canvas2d.fill();
        }
    },

    /**
     * Generates empty map
     */
    generateEmptyMap: function() {
        var tilesCount = this.TILE_COUNT_HEIGHT * this.TILE_COUNT_WIDTH;
        for (var i = 0; i !== tilesCount; i++) {
            this.map[i] = new EmptyTile();
        }
    },

    replaceObject: function(tileX, tileY, objectDefinition) {
        var index = this.getTileIndex(tileX, tileY);
        this.map[index] = new RedTile();
    },

    /**
     * Считает по координатам тайла его индекс в массиве map
     * @param tileX
     * @param tileY
     */
    getTileIndex: function(tileX, tileY) {
        var index = (tileX * this.TILE_COUNT_WIDTH) + tileY;
        if (!this.map[index]) {
            throw 'Out of game field exception!';
        }
        return index;
    }
};

/**
 * @constructor
 */
function Tile() {
    this.color = MathHelper.randInt(0, 1);

    // ширина и высота одного тайла
    this.WIDTH  = 32;
    this.HEIGHT = 32;
}
Tile.prototype = {
    getWidth: function () {
        return this.WIDTH;
    },
    getHeight: function() {
        return this.HEIGHT;
    },
    getColor: function() {
        return this.color ? 'red' : 'black';
    }
};

/**
 * @constructor
 */
function EmptyTile() {
    Tile.apply(this);
    this.color = 0;
}
EmptyTile.prototype = Object.create(Tile.prototype);

/**
 * @constructor
 */
function RedTile() {
    Tile.apply(this);
    this.color = 1;
}
RedTile.prototype = Object.create(Tile.prototype);
