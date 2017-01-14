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
        if ('object' === this._tileByTypeHash[tileType]) {
            return this._tileByTypeHash[tileType];
        }

        if (tileType === TileMap.TILE_TYPE_EMPTY) {
            tile = new EmptyTile();
        } else if (tileType === TileMap.TILE_TYPE_RED) {
            tile = new RedTile();
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
     */
    render: function() {
        var pixelOffsetX = 0;
        var pixelOffsetY = 0;
        var tile;

        for (var y = 0; y !== this.tileCountHeight; y++) {  // строки тайлов
            for (var x = 0; x !== this.tileCountWidth; x++) { // ячейки тайлов
                //console.log(x + ', ' + y);
                tile = this.renderedObject.getTileByCoordinate(x, y);
                this._drawRectangle(
                    pixelOffsetX,
                    pixelOffsetY,
                    this.tileWidthPx,
                    this.tileHeightPx,
                    tile.getColor()
                );
                pixelOffsetX = pixelOffsetX + this.tileWidthPx;
            }

            pixelOffsetY = pixelOffsetY + this.tileHeightPx;
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
    /*generateEmptyMap: function() {
        var tilesCount = this.tileCountHeight * this.tileCountWidth;
        for (var i = 0; i !== tilesCount; i++) {
            this.map[i] = new EmptyTile();
        }
    },*/

    /*replaceObject: function(tileX, tileY, objectDefinition) {
        var index = this.getTileIndex(tileX, tileY);
        this.map[index] = new Tile();
    },*/

    /**
     * Считает по координатам тайла его индекс в массиве map
     * @param tileX
     * @param tileY
     */
    /*getTileIndex: function(tileX, tileY) {
        var index = (tileX * this.tileCountWidth) + tileY;
        if (!this.map[index]) {
            throw 'Out of game field exception!';
        }
        return index;
    }*/
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
