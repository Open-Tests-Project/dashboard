"use strict";

var events = require("client/events");
var eventEmitter = require("client/pub_sub");

eventEmitter.on(events.READ_USER, function (data) {
    var header = document.querySelector("otp-header");
    header.user = data;
});

// eventEmitter.on(events.READ_TESTS, function (data) {
//     var testsArticleMain = document.querySelector("#tests main");
//     var select = document.createElement("select");
//     data.forEach(function (datum) {
//         var option = document.createElement("option");
//         option.value = datum;
//         option.innerText = datum;
//         select.appendChild(option);
//     });
//     testsArticleMain.appendChild(select);
//     select.addEventListener("change", function () {
//         console.log(this.value)
//     })
// });



module.exports = {
    actions: {
        entry_loading: function (context, event, actionMeta) {
            // console.log("entry loading", actionMeta.action.type, actionMeta.state.value)
            var message = "loading ..."
            var header = document.querySelector("otp-header");
            header.message = message;
        },
        exit_loading: function (context, event, actionMeta) {
            // console.log("exit loading", actionMeta.action.type, actionMeta.state.history.value)
            var message = "";
            var header = document.querySelector("otp-header");
            header.message = message;
        },
        entry_success: function (context, event, meta) {
            if (event.hasOwnProperty("tests")) {
                var data = event.tests;
                var testsArticleMain = document.querySelector("#tests main");
                var select = document.createElement("select");
                data.forEach(function (datum) {
                    var option = document.createElement("option");
                    option.value = datum;
                    option.innerText = datum;
                    select.appendChild(option);
                });
                testsArticleMain.appendChild(select);
                select.addEventListener("change", function () {
                    console.log(this.value)
                });
            }

        }
    }
};