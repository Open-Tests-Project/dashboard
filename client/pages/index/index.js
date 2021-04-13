"use strict";

// load components
require("client/components/index");
require("client/pages/index/presentation");
var events = require("client/events");
var domain = require("client/domain/index");
domain.exec(events.READ_USER);



function move () {
    // The current position of mouse
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

// Query the element
    const ele = document.getElementById('dragMe');

// Handle the mousedown event
// that's triggered when user drags the element
    const mouseDownHandler = function(e) {

        // Get the current mouse position
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

    };

    const mouseMoveHandler = function(e) {

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        console.log(ele.offsetTop, pos2)

        // Set the position of element
        // ele.style.top = `${ele.offsetTop + dy}px`;
        // ele.style.left = `${ele.offsetLeft + dx}px`;
        ele.style.transform = `translate(${ele.offsetLeft - pos1}px, ${pos4}px)`;
        // ele.style.top = (ele.offsetTop - pos2) + "px";
        // ele.style.left = (ele.offsetLeft - pos1) + "px";


    };

    const mouseUpHandler = function() {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    ele.addEventListener('mousedown', mouseDownHandler);
}

move();

