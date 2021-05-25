"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.CREATE_STUDY] = function (payload) {
    return {
        test_definition: payload.current_test_definition,
        lang: payload.current_test_lang,
        test_type: payload.current_test_type,
        test_name: payload.current_test,
        study_name: Date.now()
    };
}

module.exports = mapper;
