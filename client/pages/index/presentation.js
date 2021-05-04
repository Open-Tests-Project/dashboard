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
        render_tests: function (context, event, meta) {
            if (event.hasOwnProperty("data")) {
                var data = event.data;
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

        },
        render_current_test_config:function (context, event) {
            if (event.hasOwnProperty("data")) {
                var data = event.data;
                var testsArticleMain = document.querySelector("#tests main");
                var select = document.createElement("select");
                Object.keys(data).forEach(function (key) {
                    var option = document.createElement("option");
                    option.value = key;
                    option.innerText = key;
                    select.appendChild(option);
                });
                testsArticleMain.appendChild(select);
                select.addEventListener("change", function () {
                    console.log(this.value)
                });
                var config = data[Object.keys(data)[0]];
                var langSelect = document.createElement("select");
                var languages = Object.keys(config);
                languages.forEach(function (lang) {
                    var option = document.createElement("option");
                    option.value = lang;
                    option.innerText = lang;
                    langSelect.appendChild(option);
                });
                testsArticleMain.appendChild(langSelect);
                langSelect.addEventListener("change", function () {
                    console.log(this.value)
                });

                var currentConfig = config[context.current_test_lang];
                var testDefinitionArticleMain = document.querySelector("#test-definition main");
                var pre = document.createElement("pre");
                pre.innerText = JSON.stringify(currentConfig, null, 2);
                testDefinitionArticleMain.appendChild(pre);

            }
        }
    }
};