"use strict";

var shared = require("/shared");

var events = {
    CREATE_STUDY: "CREATE_STUDY",
    DELETE_STUDY: "DELETE_STUDY",
    READ_USER: "READ_USER",
    READ_TESTS: "READ_TESTS",
    READ_TEST: "READ_TEST",
    READ_STUDIES: "READ_STUDIES",
    CHANGE_TEST: "CHANGE_TEST",
    CHANGE_LANG: "CHANGE_LANG",
    CHANGE_STUDY: "CHANGE_STUDY"
};
var dataAccessRelatedEvents = [
    "CREATE_STUDY",
    "DELETE_STUDY",
    "READ_USER",
    "READ_TESTS",
    "READ_TEST",
    "READ_STUDIES"
];

dataAccessRelatedEvents.forEach(function (event) {
    var dataAccessRelatedEvent = event + shared.DATA_ACCESS_RESULT;
    events[dataAccessRelatedEvent] = dataAccessRelatedEvent;
});

module.exports = Object.freeze(events);
// module.exports = {
//     CREATE_STUDY: "CREATE_STUDY",
//     CREATE_STUDY_DATA_ACCESS_RESULT: "CREATE_STUDY_DATA_ACCESS_RESULT",
//     DELETE_STUDY: "DELETE_STUDY",
//     DELETE_STUDY_DATA_ACCESS_RESULT: "DELETE_STUDY_DATA_ACCESS_RESULT",
//     READ_USER: "READ_USER",
//     READ_USER_DATA_ACCESS_RESULT: "READ_USER_DATA_ACCESS_RESULT",
//     READ_TESTS: "READ_TESTS",
//     READ_TESTS_DATA_ACCESS_RESULT: "READ_TESTS_DATA_ACCESS_RESULT",
//     READ_TEST: "READ_TEST",
//     READ_TEST_DATA_ACCESS_RESULT: "READ_TEST_DATA_ACCESS_RESULT",
//     READ_STUDIES: "READ_STUDIES",
//     READ_STUDIES_DATA_ACCESS_RESULT: "READ_STUDIES_DATA_ACCESS_RESULT",
//     CHANGE_TEST: "CHANGE_TEST",
//     CHANGE_LANG: "CHANGE_LANG",
//     CHANGE_STUDY: "CHANGE_STUDY"
// };