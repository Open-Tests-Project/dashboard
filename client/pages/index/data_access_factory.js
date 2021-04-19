"use strict";

var events = require("client/events");

module.exports = {
    driver_options: function (event, payload) {

        var options = {};
        switch (event) {
            case events.READ_USER:
                options.method = "get";
                options.url = BASE_URL + "/api/whoami";
                break;
            case events.READ_TESTS:
                options.method = "get";
                options.url = BASE_URL + "/api/tests";
                break;

            default:
                break;
        }

        return options;
    }
};