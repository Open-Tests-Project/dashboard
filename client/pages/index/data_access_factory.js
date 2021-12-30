"use strict";

var events = require("client/events");
const {context} = require("./xstate/machine");

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
                options.url = `${BASE_URL}/api/test`;
                break;
            case events.READ_STUDIES:
                options.method = "get";
                options.url = `${BASE_URL}/api/study/test/${payload.current_test}/type/${payload.current_test_type}/lang/${payload.current_test_lang}`;
                break;
            case events.READ_TEST:
                options.method = "get";
                options.url = `${BASE_URL}/api/test/${payload.current_test}`;
                break;
            case events.CREATE_STUDY:
                options.method = "post";
                options.url = `${BASE_URL}/api/study`;
                options.data = payload;
                break;
            case events.DELETE_STUDY:
                options.method = "delete";
                options.url = `${BASE_URL}/api/study/${payload.study_id}`;
                break;
            case events.RENAME_STUDY:
                options.method = "put";
                options.url = `${BASE_URL}/api/study/${payload.study_id}`;
                options.data = {
                    study_name: payload.study_name
                };
                break;
            case events.UPDATE_STUDY:
                options.method = "put";
                options.url = `${BASE_URL}/api/study/${payload.current_test}`;
                options.data = payload.data;
                break;

            default:
                break;
        }

        return options;
    }
};