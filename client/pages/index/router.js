"use strict";

var page = require("page");
var events = require("client/events");
var initialized = false;

module.exports = function (machineInstance) {

    page({
        hashbang: true
    });

    page("/study/:study_id?", function (ctx, next) {
        machineInstance.send(events.CHANGE_STUDY, {
            study_id: ctx.params.study_id
        });
        next();
    });

    page.init = function () {
        if (!initialized) {
            initialized = true;
            page.redirect(window.location.hash.substring(2));
        }
    };
    page.buildParam = function (context) {
        if (context && context.current_study) {
            return context.current_study.study_id;
        }
        return "";
        // if (!input) {
        //     return "";
        // }
        // if (typeof input === "string") {
        //     return input;
        // } else {
        //     return input.study_id;
        // }
    }

    return page;

};