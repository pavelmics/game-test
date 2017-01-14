/***
 * Implementation of game loop pattern
 *
 * @param updateCallback
 * @param renderCallback
 * @constructor
 */
function GameLoop(updateCallback, renderCallback) {
    var self = this;
    self.realTime = 0;
    this.GAME_STEP_DURATION = 50; // ms

    this.updateCallback = function() {
        updateCallback(self.realTime);
        self.realTime += self.GAME_STEP_DURATION;
    };

    this.renderCallback = renderCallback;
}
GameLoop.prototype = {
    start: function() {
        this.nextTickTimeout = 0;
        this.tick();
    },

    /**
     * @see https://martalex.gitbooks.io/gameprogrammingpatterns/content/chapter-3/3.2-game-loop.html
     */
    tick: function() {
        var self = this;
        var update = function() {
            var updateTime;
            var renderTime;
            var commonTime;

            updateTime = TimeHelper.executionTimeDecorator(function() {
                self.updateCallback();
            });
            renderTime = TimeHelper.executionTimeDecorator(self.renderCallback);
            commonTime = updateTime + renderTime;

            if (commonTime > self.GAME_STEP_DURATION) {
                console.log('Warn: Update take more time than STEP_DURATION');
                while(commonTime > self.GAME_STEP_DURATION) {
                    self.updateCallback();
                    commonTime -= self.GAME_STEP_DURATION;
                }
            }

            self.nextTickTimeout = self.GAME_STEP_DURATION - commonTime;

            window.requestAnimationFrame(function() {
                self.tick();
            });
        };

        setTimeout(update, self.nextTickTimeout);
    }
};

var GAME_WIDTH_PX = 640;
var GAME_HEIGHT_PX = 480;

var GAME_TILE_WIDTH = 20;
var GAME_TILE_HEIGHT = 15;

window.onload = function() {
    var canvas2d = CanvasHelper.canvasBuilder(GAME_WIDTH_PX, GAME_HEIGHT_PX, 'example');
    var tileMap = new TileMap(GAME_TILE_WIDTH, GAME_TILE_HEIGHT);
    var renderer;
    var gameLoop;

    tileMap.generateEmptyMap();
    renderer = new Renderer(canvas2d, tileMap, GAME_WIDTH_PX, GAME_HEIGHT_PX);
    renderer.render();

    var i = 0;
    gameLoop = new GameLoop(function(realTime) {
        if (0 === realTime % 100) {
            if (i === GAME_TILE_HEIGHT) {
                i = 0;
            }
            if (i > 0) {
                tileMap.replaceObject(
                    i - 1,
                    i - 1,
                    TileMap.TILE_TYPE_EMPTY
                );
            }

            tileMap.replaceObject(
                /*MathHelper.randInt(0, 19),
                MathHelper.randInt(0, 14),*/
                i,
                i,
                TileMap.TILE_TYPE_RED
            );
            i++;
        }
    }, function() {
        renderer.render();
    });

    gameLoop.start();
};