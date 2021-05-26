"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.CREATE_STUDY] = function (payload) {
    var studyName = Date.now();
    var requestPayload = {
        test_name: payload.current_test,
        study_name: studyName
    };
    var testType = payload.current_test_type;
    var lang = payload.current_test_lang;
    requestPayload[studyName] = {};
    requestPayload[studyName][testType] = {};
    requestPayload[studyName][testType][lang] = payload.current_test_definition;

    return requestPayload;
}

module.exports = mapper;
