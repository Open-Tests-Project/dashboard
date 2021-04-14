"use strict";

// load components
require("client/components/index");
require("client/pages/index/presentation");
var events = require("client/events");
var Mover = require("client/pages/index/mover");
var requestMapper = require("client/pages/index/request_mapper");
var responseMapper = require("client/pages/index/response_mapper");
var dataAccessFactory = require("client/pages/index/data_access_factory");
var Domain = require("client/Domain/index");
var domain = Domain(requestMapper, responseMapper, dataAccessFactory);
domain.exec(events.READ_USER);


function getArticles () {
    return document.querySelectorAll("article");
}

function initLayout () {
    var main = document.querySelector("main");
    [].forEach.call(getArticles(), function (article) {

        var computedStyle = getComputedStyle(article);
        article.style.left = (article.offsetLeft - parseInt(computedStyle.marginLeft, 10)) + "px";
        article.style.top = article.offsetTop + "px";

        console.log(article.offsetTop)
    });

    var moverCollection = [];

    document.querySelector('input[name="move"]').addEventListener("change", function () {
        var checked = this.checked;
        // var position = "static";
        // if (this.checked) {
        //     position = "absolute";
        // }
        moverCollection.forEach(function (mover) {
            mover.stop();
        });
        moverCollection.length = 0;
        [].forEach.call(getArticles(), function (article) {
            // article.style.position = position;
            // mover.start(article, main)
            //
            var mover = Mover(article, main);
            moverCollection.push(mover);

            if (checked) {
                article.style.position = "absolute";
                mover.start();
            } else {
                article.style.position = "static";
                // mover.stop();
            }

        });
    });

}
// function activateMove (ele) {
//     let x = 0;
//     let y = 0;
//
//     var main = document.querySelector("main");
//
//
//     const mouseDownHandler = function(e) {
//
//         y = e.clientY - ele.offsetTop;
//         x = e.clientX - ele.offsetLeft;
//
//         // Attach the listeners to `document`
//         document.addEventListener('mousemove', mouseMoveHandler);
//         document.addEventListener('mouseup', mouseUpHandler);
//     };
//
//     const mouseMoveHandler = function(e) {
//         requestAnimationFrame(function () {
//             console.log("move")
//             ele.style.top = `${e.clientY - y}px`;
//             ele.style.left = `${e.clientX - main.offsetLeft - x}px`;
//         })
//
//     };
//
//     const mouseUpHandler = function() {
//         console.log("up")
//         // Remove the handlers of `mousemove` and `mouseup`
//         document.removeEventListener('mousemove', mouseMoveHandler);
//         document.removeEventListener('mouseup', mouseUpHandler);
//     };
//
//     ele.addEventListener('mousedown', mouseDownHandler);
// }

window.onload = initLayout;
