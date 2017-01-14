/**
 * This file contains the helpers object. Hire must be only objects with static methods (like static facade).
 * If you write hire some classes, you possible went wrong somewhere
 */

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
    },
    sleep: function(ms) {
        var start = Date.now();
        while (Date.now() < start + ms) { }
    },
    createInterval: function(intervalMs, startTime, callback) {
        return function(gameTime) {
            if ((gameTime - startTime) >= intervalMs) {
                startTime = gameTime;
                callback();
            }
        }
    }
};

OOPHelper = {
    mustBeOverloaded: function() {
        throw "The function must be overloaded!";
    }
};

ObjectHelper = {

    /**
     * Simple extend function
     * @param obj1
     * @param obj2
     */
    extend: function(obj1, obj2) {
        for (var i in obj2) {
            if (obj2.hasOwnProperty(i)) {
                obj1[i] = obj2[i];
            }
        }

        return obj1;
    }
};