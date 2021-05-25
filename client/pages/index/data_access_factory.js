"use strict";

var events = require("client/events");

module.exports = {
    driver_options: function (event, payload) {

        var options = {};
        switch (event) {
            case events.READ_USER:
                options.method = "get";
                options.url = `${BASE_URL}/api/whoami`;
                break;
            case events.READ_TESTS:
                options.method = "get";
                options.url = `${BASE_URL}/api/tests`;
                break;
            case events.READ_TEST:
                options.method = "get";
                options.url = `${BASE_URL}/api/test/${payload.current_test}`;
                break;
            case events.CREATE_STUDY:
                options.method = "post";
                options.url = `${BASE_URL}/api/study/${payload.test_name}`;
                options.data = payload;
                break;
            default:
                break;
        }

        return options;
    }
};