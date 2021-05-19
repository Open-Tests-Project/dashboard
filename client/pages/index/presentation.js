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


function _renderForm (context) {

    var currentConfig = context.current_test_definition;
    var form = document.createElement("form");
    var submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Save";
    if (!context.current_test_readonly) {
        form.appendChild(submit);
    }

    var fields = Object.keys(currentConfig);
    var testDefinitionArticleMain = document.querySelector("#test-definition main");
    testDefinitionArticleMain.innerHTML = null;
    fields.forEach(function (field) {
        var fieldValue = currentConfig[field];
        var input;
        if (typeof fieldValue === "object") {
            input = document.createElement("select");
            input.multiple = true;
            fieldValue.forEach(function (item) {
                var option = document.createElement("option");
                option.value = item;
                option.innerText = item;
                input.appendChild(option);
            });
        } else {
            if (fieldValue.length >=50) {
                input = document.createElement("textarea");
            } else {
                input = document.createElement("input");
                input.type = "text";
            }
            input.value = fieldValue;
            input.name = "field";
        }

        input.disabled = context.current_test_readonly;
        var label = document.createElement("label");
        label.innerText = field;
        label.appendChild(input);
        label.appendChild(document.createElement("br"));
        form.appendChild(label);
        testDefinitionArticleMain.appendChild(form);
    });
}

function _buildLangSelect (context) {
    var languages = context.current_test_languages;
    var langSelect = document.createElement("select");
    langSelect.name = "lang-select";
    languages.forEach(function (lang) {
        var option = document.createElement("option");
        option.value = lang;
        option.selected = lang === context.current_test_lang;
        option.innerText = lang;
        langSelect.appendChild(option);
    });
    langSelect.addEventListener("change", function () {
        eventEmitter.emit(events.CHANGE_LANG, this.value);
    });
    return langSelect;
}


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
        render_tests: function (context) {

            // if (context.hasOwnProperty("tests")) {
                // var data = context.tests;
                var testsArticleMain = document.querySelector("#tests main");
                var select = document.createElement("select");
                context.tests.forEach(function (datum) {
                    var option = document.createElement("option");
                    option.value = datum;
                    option.innerText = datum;
                    select.appendChild(option);
                });
                testsArticleMain.appendChild(select);
                select.addEventListener("change", function () {
                    console.log(this.value)
                });
            // }

        },
        render_current_test_config: function (context) {

            // if (context.hasOwnProperty("current_test_config")) {
                // var data = context.current_test_config;
                var testsArticleMain = document.querySelector("#tests main");

                // render test types
                var select = document.createElement("select");
                Object.keys(context.current_test_config).forEach(function (key) {
                    var option = document.createElement("option");
                    option.value = key;
                    option.innerText = key;
                    select.appendChild(option);
                });
                testsArticleMain.appendChild(select);
                select.addEventListener("change", function () {
                    eventEmitter.emit(events.CHANGE_TEST, this.value);
                });

                // render languages select
                testsArticleMain.appendChild(_buildLangSelect(context));

                // render form
                _renderForm(context);

            // }
        },
        render_current_test_definition: function (context) {
            _renderForm(context);
        },
        render_lang_select: function (context) {
            var testsArticleMain = document.querySelector("#tests main");
            var langSelect = testsArticleMain.querySelector(`select[name="lang-select"]`);
            testsArticleMain.replaceChild(_buildLangSelect(context), langSelect);
        }
    }
};