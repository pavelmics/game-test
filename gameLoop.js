
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
    this.renderCallback = function() {
        renderCallback(self.realTime);
    };
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
            renderTime = TimeHelper.executionTimeDecorator(function() {
                self.renderCallback();
            });
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