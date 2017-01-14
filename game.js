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
    this.GAME_STEP_DURATION = 25; // ms

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


/**
 * Функция которая блокирует выполнение на указанное количество ms
 * @param ms
 */
function wasteTime(ms) {
    var start = Date.now();
    while (Date.now() < start + ms) { }
}

window.onload = function() {
    var canvas2d = CanvasHelper.canvasBuilder(640, 480, 'example');
    var renderer = new Renderer(canvas2d);
    var gameLoop;

    renderer.generateEmptyMap();
    renderer.render();

    gameLoop = new GameLoop(function(realTime) {
        //wasteTime(MathHelper.randInt(100, 150));
        if (0 === realTime % 500) {
            renderer.replaceObject(MathHelper.randInt(0, 14), MathHelper.randInt(0, 19), {});
        }
    }, function() {
        renderer.render();
    });

    gameLoop.start();
};