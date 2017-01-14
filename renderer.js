/**
 * @param {int} width
 * @param {int} height
 * @constructor
 */
function TileMap(width, height) { // todo: IRenderable
    this.width  = width;
    this.height = height;
    this.map = [];
    this._tileByTypeHash = {};
}

TileMap.TILE_TYPE_EMPTY = 'empty';
TileMap.TILE_TYPE_RED   = 'red';
TileMap.TILE_TYPE_BLINK = 'blink';

TileMap.prototype = {
    getWidth: function() {
        return this.width;
    },

    getHeight: function() {
        return this.height;
    },

    getTileByCoordinate: function(x, y) {
        var index = this._getTileIndex(x, y);
        return this.map[index];
    },

    replaceObject: function(tileX, tileY, tileType) {
        var index = this._getTileIndex(tileX, tileY);
        this.map[index] = this.getTileByType(tileType);
    },

    /**
     * Считает по координатам тайла его индекс в массиве map
     * @param tileX
     * @param tileY
     */
    _getTileIndex: function(tileX, tileY) {
        var index = (tileY * this.width) + tileX;
        if (!this.map[index]) {
            throw 'Out of game field exception!';
        }
        return index;
    },

    getTileByType: function(tileType) {
        var tile;
        if ('object' === typeof this._tileByTypeHash[tileType]) {
            return this._tileByTypeHash[tileType];
        }

        if (tileType === TileMap.TILE_TYPE_EMPTY) {
            tile = new EmptyTile();
        } else if (tileType === TileMap.TILE_TYPE_RED) {
            tile = new RedTile();
        } else if (tileType === TileMap.TILE_TYPE_BLINK) {
            tile = new BlinkTile(
                {r: 255, b: 255, g: 255},
                {r: 50, b: 50, g: 50},
                100
            );
        } else {
            throw "That tile type undeclared!";
        }

        this._tileByTypeHash[tileType] = tile;

        return this._tileByTypeHash[tileType];
    },

    /**
     * Generates empty map
     */
    generateEmptyMap: function() {
        var tilesCount = this.getHeight() * this.getWidth();
        for (var i = 0; i !== tilesCount; i++) {
            this.map[i] = this.getTileByType(TileMap.TILE_TYPE_EMPTY);
        }
    }
};


function Renderer(canvas2d, rendarableObject, widthInPx, heightInPx) {
    this.canvas2d = canvas2d;
    this.map = [];
    this.renderedObject = rendarableObject;

    // ширина и высота canvas
    this.canvasWidthPx  = widthInPx;
    this.canvasHeightPx = heightInPx;

    // ширина и высота поля в тайлах, считаем от 0
    this.tileCountWidth  = this.renderedObject.getWidth();
    this.tileCountHeight = this.renderedObject.getHeight();

    // ширина и высота одного тайла
    this.tileWidthPx  = this.canvasWidthPx / this.tileCountWidth;
    this.tileHeightPx = this.canvasHeightPx / this.tileCountHeight;
}
Renderer.prototype = {
    /**
     * Renders the game field
     * @param {int} realGameTime milliseconds from start
     */
    render: function(realGameTime) {
        //console.log(realGameTime);
        var pixelOffsetX = 0;
        var pixelOffsetY = 0;
        var tile;

        for (var y = 0; y !== this.tileCountHeight; y++) {  // строки тайлов
            for (var x = 0; x !== this.tileCountWidth; x++) { // ячейки тайлов
                //console.log(x + ', ' + y);
                tile = this.renderedObject.getTileByCoordinate(x, y);
                tile.draw(
                    this.canvas2d,
                    tile,
                    pixelOffsetX,
                    pixelOffsetY,
                    this.tileWidthPx,
                    this.tileHeightPx,
                    realGameTime
                );
                pixelOffsetX = pixelOffsetX + this.tileWidthPx;
            }

            pixelOffsetY = pixelOffsetY + this.tileHeightPx;
            pixelOffsetX = 0;
        }
    },
};