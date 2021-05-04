"use strict";

// load components
require("client/components/index");
var presentation = require("client/pages/index/presentation");
var events = require("client/events");
var eventEmitter = require("client/pub_sub");
var Machine = require("client/pages/index/xstate/index").default;
var Mover = require("client/pages/index/mover");
var requestMapper = require("client/pages/index/request_mapper");
var responseMapper = require("client/pages/index/response_mapper");
var dataAccessFactory = require("client/pages/index/data_access_factory");
var Domain = require("client/Domain/index");
var domain = Domain(requestMapper, responseMapper, dataAccessFactory);
domain.exec(events.READ_USER);

const domainActions = {
    start_loading_tests: function () {
        domain.exec(events.READ_TESTS);
    },
    start_loading_current_test: function (context) {
        domain.exec(events.READ_TEST, context);
    }
}
var machineInstance = Machine({
    actions: Object.assign({}, presentation.actions, domainActions)
});
machineInstance.start();
machineInstance.send("LOAD_TESTS");
machineInstance.onTransition(function (state) {
    // if the state is changed, do actions with side effect
    if (state.changed) {
        console.log(state.value, state.context);
    }

});
eventEmitter.on(events.READ_TESTS, function (data) {
    machineInstance.send("RESOLVE", {data});
});
eventEmitter.on(events.READ_TEST, function (data) {
    machineInstance.send("RESOLVE", {data});
});



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