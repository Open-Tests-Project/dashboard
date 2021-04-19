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
domain.exec(events.READ_TESTS);


function initLayout () {

    function getArticles () {
        return document.querySelectorAll("article");
    }

    var main = document.querySelector("main");
    [].forEach.call(getArticles(), function (article) {

        var computedStyle = getComputedStyle(article);
        article.style.left = (article.offsetLeft - parseInt(computedStyle.marginLeft, 10)) + "px";
        article.style.top = article.offsetTop + "px";

    });

    var moverCollection = [];

    document.querySelector('input[name="move"]').addEventListener("change", function () {
        var checked = this.checked;

        moverCollection.forEach(function (mover) {
            mover.stop();
        });
        moverCollection.length = 0;
        [].forEach.call(getArticles(), function (article) {
            var mover = Mover(article, main);
            moverCollection.push(mover);

            if (checked) {
                // article.style.position = "absolute";
                article.classList.add("draggable");
                mover.start();
            } else {
                // article.style.position = "static";
                article.classList.remove("draggable");
                mover.stop();
            }

        });
    });

}
window.onload = initLayout;