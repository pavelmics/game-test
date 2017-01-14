MathHelper = {

    /**
     * Returns random int from min to max
     * @param min
     * @param max
     * @returns {*}
     */
    randInt: function(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
};

CanvasHelper = {
    canvasBuilder: function(width, height, elementId) {
        var canvas  = document.getElementById("example");
        var context = canvas.getContext('2d');

        context.width  = width;
        context.height = height;

        return context;
    }
};

TimeHelper = {
    executionTimeDecorator: function(callback) {
        var currentTime = Date.now();
        callback();
        return Date.now() - currentTime;
    }
};