"use strict";


module.exports = function (element, container) {
    var x = 0;
    var y = 0;

    const mouseDownHandler = function(e) {

        y = e.clientY - element.offsetTop;
        x = e.clientX - element.offsetLeft;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        requestAnimationFrame(function () {
            console.log("move")
            element.style.top = `${e.clientY - y}px`;
            element.style.left = `${e.clientX - container.offsetLeft - x}px`;
        })

    };

    const mouseUpHandler = function() {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    return {
        start: function () {
            x = 0;
            y = 0;
            element.addEventListener('mousedown', mouseDownHandler);
        },
        stop: function () {
            element.removeEventListener('mousedown', mouseDownHandler);
        }
    };
};