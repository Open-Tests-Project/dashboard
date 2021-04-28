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
        "current_test": undefined
    },
    states: {
        idle: {
            on: {
                LOAD_INITIAL_DATA: {
                    target: "loading",
                    actions: ["load_initial_data"]
                }
            }
        },
        loading: {
            entry: ["entry_loading"],
            on: {
                RESOLVE: {
                    target: "success",
                    actions: assign({
                        tests: function (context, event) {
                            // assign is a pure function (no side effects in it)
                            return event.tests;
                        },
                        current_test: function (context, event) {
                            if (event.tests.length === 1) {
                                return event.tests[0];
                            }
                        }
                    })
                },
                REJECT: 'failure'
            },
            exit: ["exit_loading"],
        },
        success: {
            entry: ["entry_success"],
            // on: {
            //     FETCH: 'loading'
            // }
        },
        failure: {
            on: {
                RETRY: {
                    target: 'loading',
                    // actions: assign({
                    //     retries: (context, event) => context.retries + 1
                    // })
                }
            }
        }
    }
};