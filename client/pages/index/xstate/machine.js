"use strict";

var { assign } = require("xstate");

// function transition (state, event) {
//     var newState; // ......
//     return newState;
// }
var transitions = {

    "EVENT01": "next_state"

};
// state01 -> event01 -> transition01 -> state02

// actions are side effects
// 3 type of actions:
// - transition actions (do/fetch)
// - entry actions (showSpinner)
// - exit actions (hideSpinner)

// todo https://frontendmasters.com/courses/xstate/assignment-action-exercise/

module.exports = {
    id: "dashboard/index",
    initial: "idle",
    context: {
        "tests": [],
        "current_test": undefined,
        "current_test_type": undefined,
        "current_test_config": undefined,
        "current_test_definition": undefined,
        "current_test_languages": undefined,
        "current_test_lang": "ENG",
        "current_test_readonly": true,
        "current_test_studies": undefined
    },
    states: {
        idle: {
            on: {
                LOAD_TESTS: {
                    target: "loading_tests"
                },
                CHANGE_TEST: {
                    target: "test_changed",
                    actions: assign({
                        current_test_type: function (context, event) {
                            return event.current_test_type;
                        },
                        current_test_definition: function (context, event) {
                            var currentTestType = event.current_test_type;
                            if (context.current_test_config.hasOwnProperty(currentTestType)) {
                                if (context.current_test_config[currentTestType].hasOwnProperty(context.current_test_lang)) {
                                    return context.current_test_config[currentTestType][context.current_test_lang];
                                } else {
                                    var currentLang = Object.keys(context.current_test_config[currentTestType])[0];
                                    return context.current_test_config[currentTestType][currentLang];
                                }

                            }
                        },
                        current_test_lang: function (context, event) {
                            var currentTestType = event.current_test_type;
                            if (context.current_test_config.hasOwnProperty(currentTestType)) {
                                var currentLang = Object.keys(context.current_test_config[currentTestType])[0];
                                return currentLang;
                            }
                        },
                        current_test_languages: function (context, event) {
                            var currentTestType = event.current_test_type;
                            if (context.current_test_config.hasOwnProperty(currentTestType)) {
                                return Object.keys(context.current_test_config[currentTestType]);
                            }
                        }
                    })
                },
                CHANGE_LANG: {
                    target: "test_changed",
                    actions: assign({
                        current_test_lang: function (context, event) {
                            return event.current_test_lang;
                        },
                        current_test_definition: function (context, event) {
                            return context.current_test_config[context.current_test_type][event.current_test_lang];
                        }
                    })
                },
                CREATE_STUDY: {
                    target: "creating_study"
                }
            }
        },
        loading_tests: {
            entry: ["entry_loading", "start_loading_tests"],
            on: {
                RESOLVE: {
                    target: "tests_loaded",
                    actions: assign({
                        tests: function (context, event) {
                            return event.data;
                        },
                        current_test: function (context, event) {
                            if (event.data && event.data.length === 1) {
                                return event.data[0];
                            }
                        }
                    })
                },
                REJECT: {}
            },
            exit: ["render_tests", "exit_loading"],
        },
        loading_current_test_config: {
            entry: ["entry_loading", "start_loading_current_test"],
            on: {
                RESOLVE: {
                    target: "loading_current_studies",
                    actions: assign({
                        current_test_config: function (context, event) {
                            return event.data;
                        },
                        current_test_type: function (context, event) {
                            if (event.data && Object.keys(event.data).length) {
                                return Object.keys(event.data)[0];
                            }
                        },
                        current_test_languages: function (context, event) {
                            if (event.data && Object.keys(event.data).length) {
                                var config = event.data[Object.keys(event.data)[0]];
                                return Object.keys(config);
                            }
                        },
                        current_test_definition: function (context, event) {
                            if (event.data && Object.keys(event.data).length) {
                                var config = event.data[Object.keys(event.data)[0]];
                                if (config.hasOwnProperty(context.current_test_lang)) {
                                    return config[context.current_test_lang];
                                }
                            }
                        }
                    })
                },
                REJECT: {}
            },
            exit: ["render_current_test_config"],
        },
        loading_current_studies: {
            entry: ["start_loading_current_studies"],
            on: {
                RESOLVE: {
                    target: "idle",
                    actions: assign({
                        current_test_studies: function (context, event) {
                            return event.data;
                        }
                    })
                },
                REJECT: {}
            },
            exit: ["render_current_studies", "exit_loading"],
        },

        creating_study: {
            entry: ["entry_loading", "start_creating_study"],
            on: {
                RESOLVE: {
                    target: "idle",
                    actions: assign({
                        current_test_readonly: function (context, event) {
                            return false;
                        },
                        current_test_definition: function (context, event) {
                            var testName = Object.keys(event.data)[0];
                            return event.data[testName][context.current_test_type][context.current_test_lang];
                        }
                    })
                },
                REJECT: {}
            },
            exit: ["render_current_test_config", "exit_loading"]
        },

        test_changed: {
            always: [
                {
                    target: "idle"
                }
            ],
            exit: ["render_current_test_definition", "render_lang_select"]
        },
        tests_loaded: {
            always: [
                {
                    cond: function (context) {
                        return context.current_test;
                    },
                    target: "loading_current_test_config"
                },
                {
                    target: "idle"
                }
            ]
        }


    }
};