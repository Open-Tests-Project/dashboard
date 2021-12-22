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
    };
    page.buildParam = function (input) {
        if (!input) {
            return "";
        }
        if (typeof input === "string") {
            return input;
        } else {
            return Object.keys(input)[0] || "";
        }
    }

    return page;

};