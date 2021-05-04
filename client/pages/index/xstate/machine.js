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
        "current_test_config": undefined,
        "current_test_definition": undefined,
        "current_test_lang": "ENG"
    },
    states: {
        idle: {
            on: {
                LOAD_TESTS: {
                    target: "loading_tests"
                }
            }
        },
        loading_tests: {
            entry: ["start_loading_tests"],
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
            exit: ["render_tests"],
        },
        loading_current_test_config: {
            entry: ["start_loading_current_test"],
            on: {
                RESOLVE: {
                    target: "idle",
                    actions: assign({
                        current_test_config: function (context, event) {
                            return event.data;
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