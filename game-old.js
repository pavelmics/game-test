// RENDER

/**
 * It is helper function for canvas initialization
 * @param width
 * @param heigth
 * @param elementId
 */
function canvasBuilder(width, heigth, elementId) {
    var canvas  = document.getElementById("example");
    var context = canvas.getContext('2d');

    context.width  = width;
    context.height = heigth;

    return context;
}

/**
 * Shortcat for drawing rectangle on canvas
 * @param canvas2d
 * @param x
 * @param y
 * @param w
 * @param h
 * @param color
 */
function helperDrawRectangle(canvas2d, x, y, w, h, color) {
    canvas2d.beginPath();
    canvas2d.rect(x, y, w, h);
    if ('string' === typeof color) {
        canvas2d.fillStyle = color;
        canvas2d.fill();
    }
}

/**
 * Returns random int from
 * @param min
 * @param max
 * @returns {*}
 */
function helperRandom(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}


// Tilemap object
function Render(canvas2d) {
    this.canvas2d = canvas2d;
    this.map = [];

    // количество кадров в секунду
    this.FPS = 30;

    // ширина и высота поля в тайлах, считаем от 0
    this.TILE_COUNT_WIDTH  = 20;
    this.TILE_COUNT_HEIGHT = 15;
}
Render.prototype = {

    /**
     * Generates random map of tiles
     */
    generateRandomMap: function() {
        var tilesCount = this.TILE_COUNT_HEIGHT * this.TILE_COUNT_WIDTH;
        for (var i = 0; i !== (tilesCount - 1); i++) {
            this.map[i] = new Tile();
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
                index = (y * this.TILE_COUNT_WIDTH) + x;  // строку умножаем на количество ячеек в строке и добовляем y
                tile = this.map[index];
                helperDrawRectangle(
                    this.canvas2d,
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

    /**
     *
     */
    start: function() {
        var self = this;
        setInterval(function() {
            self.render();
        }, Math.round((1000 / self.FPS)));
    },

    /**
     *
     * @returns {number}
     */
    getTailWidth: function() {
        return this.TILE_COUNT_WIDTH;
    },

    /**
     *
     * @returns {number}
     */
    getTailHeight: function() {
        return this.TILE_COUNT_HEIGHT;
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
    },

    /**
     * Ставит объект в указанные координаты
     * @param tileX - координаты тайла на grid-е
     * @param tileY - координаты тайла на grid-е
     * @param objectDefinition - параметры объекта, такие как цвет, форма и тд
     */
    replaceObject: function(tileX, tileY, objectDefinition) {
        var index = this.getTileIndex(tileX, tileY);
        this.map[index] = new RedTile();
    },

    /**
     * Ставит указанный тайл пустым
     * @param tileX
     * @param tileY
     */
    setEmpty: function(tileX, tileY) {
        var index = this.getTileIndex();
        this.map[index] = new EmptyTile();
    }
};

function Tile() {
    this.color = helperRandom(0, 1);

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

function EmptyTile() {
    Tile.apply(this);
    this.color = 0;
}
EmptyTile.prototype = Object.create(Tile.prototype);

function RedTile() {
    Tile.apply(this);
    this.color = 1;
}
RedTile.prototype = Object.create(Tile.prototype);

// End RENDER

// GAME
function Game(render) {
    this.render = null;
    this.init();
}
Game.prototype = {
    init: function() {
        var self = this;
        self.render = new Render(canvasBuilder(640, 480, 'example'));
        self.render.generateEmptyMap();
        self.render.start();
        setInterval(function() {
            self.render.replaceObject(helperRandom(0, 14), helperRandom(0, 19), {});
        }, 200);
        //self.render.replaceObject(14, 15, {});
    },

    handleMovie: function(movie) {

    }
};

function Movie(objectDefinition, startX, startY, stepCount, delayBefore, delayAfter) {
    this.objectDefinition = objectDefinition;
    this.startX = startX;
    this.startY = startY;
    this.delayBefore = delayBefore;
    this.delayAfter = delayAfter;
}
Movie.prototype = {
    getCurrentCoordinates: function() {
        return [this.startX, this.startY];
    },
    calculateAndGetNextCoordinates: function() {
        this.startX += 1;
        return [this.startX, this.startY];
    }
};

function Player() {

}



(function() {
    window.onload = init;

    function init() {
        var game = new Game();
    }
})();