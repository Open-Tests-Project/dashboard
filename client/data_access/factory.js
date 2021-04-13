"use strict";

var events = require("client/events");
// const BASE_URL = window.BASE_URL;

module.exports = {
    exec: function (driver) {

    },

    driver_options: function (driver, event, payload) {

        var options = {};
        switch (event) {
            case events.READ_USER:
                options.method = "get";
                options.url = BASE_URL + "/api/whoami";
                break;

            default:
                break;
        }

        return options;
    }
};