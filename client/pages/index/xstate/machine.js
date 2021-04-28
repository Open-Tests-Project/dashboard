"use strict";

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
        "tests": []
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
                    actions: ["loading_success"]
                },
                REJECT: 'failure'
            },
            exit: ["exit_loading"],
        },
        success: {

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