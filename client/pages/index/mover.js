"use strict";


module.exports = function (element, container) {
    var x = 0;
    var y = 0;

    const mouseDownHandler = function(e) {

        y = e.clientY - element.offsetTop;
        x = e.clientX - element.offsetLeft;

        // Attach the listeners to `document`
        document.body.addEventListener('mousemove', mouseMoveHandler);
        document.body.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        requestAnimationFrame(function () {
            element.style.top = `${e.clientY - y}px`;
            element.style.left = `${e.clientX - container.offsetLeft - x}px`;
        })

    };

    const mouseUpHandler = function() {
        // Remove the handlers of `mousemove` and `mouseup`
        document.body.removeEventListener('mousemove', mouseMoveHandler);
        document.body.removeEventListener('mouseup', mouseUpHandler);
    };
    return {
        start: function () {
            x = 0;
            y = 0;
            element.querySelector("header").addEventListener('mousedown', mouseDownHandler);
        },
        stop: function () {
            element.querySelector("header").removeEventListener('mousedown', mouseDownHandler);
        }
    };
};