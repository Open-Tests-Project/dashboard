"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.CREATE_STUDY] = function (payload) {

    return {
        test_type: payload.current_test_type,
        test_name: payload.current_test,
        lang: payload.current_test_lang,
        study_name: ""+Date.now()
    };
};

mapper[events.READ_STUDIES] = function (payload) {
    return {
        current_test: payload.current_test,
        current_test_type: payload.current_test_type,
        current_test_lang: payload.current_test_lang.toLowerCase()
    };
};

mapper[events.DELETE_STUDY] = function (payload) {
    return {
        study_id: payload.current_study.study_id
    };
};


module.exports = mapper;
