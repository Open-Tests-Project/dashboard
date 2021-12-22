"use strict";

var page = require("page");
var events = require("client/events");
var initialized = false;

module.exports = function (machineInstance) {

    page({
        hashbang: true
    });

    page("/study/:study?", function (ctx, next) {
        machineInstance.send(events.CHANGE_STUDY, {
            current_study: ctx.params.study
        });
        next();
    });

    page.init = function () {
        if (!initialized) {
            initialized = true;
            page.redirect(window.location.hash.substring(2));
        }
    }

    return page;

};