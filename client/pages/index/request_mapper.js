"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.CREATE_STUDY] = function (payload) {
    var studyName = Date.now();
    var study = {};
    var testType = payload.current_test_type;
    var lang = payload.current_test_lang;
    study[studyName] = {};
    study[studyName][testType] = {};
    study[studyName][testType][lang] = payload.current_test_definition;

    return {
        study: study,
        test_name: payload.current_test
    };
}

module.exports = mapper;
