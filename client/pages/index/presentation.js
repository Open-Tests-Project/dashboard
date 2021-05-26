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

function _buildTestTypesSelect (context, name) {
    var select = document.createElement("select");
    select.name = name;
    Object.keys(context.current_test_config).forEach(function (key) {
        var option = document.createElement("option");
        option.value = key;
        option.innerText = key;
        select.appendChild(option);
    });
    select.addEventListener("change", function () {
        eventEmitter.emit(events.CHANGE_TEST, this.value);
    });
    return select;
}

function _buildLangSelect (context, name) {
    var languages = context.current_test_languages;
    var langSelect = document.createElement("select");
    langSelect.name = name;
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

function _renderTestTypesSelect (context) {
    var testsArticleMain = document.querySelector("#tests main");
    var name = "test-types";
    var select = testsArticleMain.querySelector(`select[name="${name}"]`);
    if (select) {
        testsArticleMain.replaceChild(_buildTestTypesSelect(context, name), select);
    } else {
        testsArticleMain.appendChild(_buildTestTypesSelect(context, name));
    }
}

function _renderLangSelect (context) {
    var testsArticleMain = document.querySelector("#tests main");
    var name = "lang";
    var select = testsArticleMain.querySelector(`select[name="${name}"]`);
    if (select) {
        testsArticleMain.replaceChild(_buildLangSelect(context, name), select);
    } else {
        testsArticleMain.appendChild(_buildLangSelect(context, name));
    }
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
            _renderTestTypesSelect(context);
            _renderLangSelect(context);
            _renderForm(context);
        },
        render_current_test_definition: function (context) {
            _renderForm(context);
        },
        render_lang_select: _renderLangSelect,
        render_current_studies: function (context) {
            console.log(context)
            // todo simone render studies select in the studies main
        }
    }
};