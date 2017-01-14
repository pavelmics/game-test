function AbstractGame(config) {
    var baseConfig = {
        canvasElementId: "game",
        gameWidthPx: 800,
        gameHeightPx: 600,
        gameTileWidth: 20,
        gameTileHeight: 15
    };

    this.config = ObjectHelper.extend(baseConfig, config);

    this.gameLoop  = null;
    this.tileMap   = null;
    this.renderer  = null;

    this._init();
}
AbstractGame.prototype = {

    /**
     * Run the game
     */
    run: function() {
      this.gameLoop.start();
    },

    /**
     * Every frame callback
     */
    update: OOPHelper.mustBeOverloaded,

    _init: function() {
        var self = this;
        // tile map
        self.tileMap = new TileMap(self.config.gameTileWidth, self.config.gameTileHeight);
        self.tileMap.generateEmptyMap();

        // renderer
        self.renderer = new Renderer(
            self._buildCanvasContext(),
            self.tileMap,
            self.config.gameWidthPx,
            self.config.gameHeightPx
        );
        self.renderer.render();

        // game loop
        self.gameLoop = new GameLoop(function(realTime) {
            self.update(realTime);
        }, function(realTime) {
            self.renderer.render(realTime);
        });
    },

    _buildCanvasContext: function() {
        var canvas  = document.getElementById(this.config.canvasElementId);
        var context = canvas.getContext('2d');

        canvas.setAttribute('width', this.config.gameWidthPx.toString());
        canvas.setAttribute('height', this.config.gameHeightPx.toString());

        context.width  = this.config.gameWidthPx;
        context.height = this.config.gameHeightPx;

        return context;
    }
};


function Game(config) {
    AbstractGame.apply(this, arguments);

    var self = this;

    this.interval = TimeHelper.createInterval(500, 0, function() {
        self.tileMap.replaceObject(
            MathHelper.randInt(0, self.config.gameTileWidth - 1),
            MathHelper.randInt(0, self.config.gameTileHeight - 1),
            TileMap.TILE_TYPE_BLINK
        );
    });
}
Game.prototype = Object.create(AbstractGame.prototype);

/**
 *
 * @param realTime
 */
Game.prototype.update = function(realTime) {
    this.interval(realTime);
};

window.onload = function() {
    var game = new Game({
        gameWidthPx: 1024,
        gameHeightPx: 786,
        gameTileWidth: 20 * 5,
        gameTileHeight: 15 * 5
    });
    game.run();
};