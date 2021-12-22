"use strict";

var events = require("client/events");
var eventEmitter = require("client/pub_sub");
var texts = require("/texts");

eventEmitter.on(events.READ_USER_DATA_ACCESS_RESULT, function (data) {
    var header = document.querySelector("otp-header");
    header.user = data;
});


function _renderForm (context, formContainer) {

    formContainer.innerHTML = null;

    if (!context.current_study && !context.current_test_readonly) {
        return;
    }

    var currentConfig = context.current_test_definition;
    var form = document.createElement("form");

    if (!context.current_test_readonly) {
        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Save";
        form.appendChild(submit);
        // delete study button
        var button = document.createElement("button");
        button.innerText = texts.test_definition.button;
        button.addEventListener("click", function (event) {
            eventEmitter.emit(events.DELETE_STUDY, context.current_study);
        });
        formContainer.appendChild(button);

        var studyName = document.createElement("input");
        studyName.type = "hidden";
        studyName.name = "study_name";
        studyName.value = context.current_study;
        form.appendChild(studyName);
    }

    var fields = Object.keys(currentConfig);

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
        formContainer.appendChild(form);
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

function _renderStudies (context) {
    var studiesArticleMain = document.querySelector("#studies main");
    var name = "studies";
    studiesArticleMain.innerHTML = "";
    var button = document.createElement("button");
    button.innerText = texts.studies.button;
    button.addEventListener("click", function () {
        eventEmitter.emit(events.CREATE_STUDY);
    })
    if (Object.keys(context.current_test_studies).length) {
        studiesArticleMain.appendChild(_buildStudiesSelect(context, name));
    } else {
        var text = document.createTextNode(texts.studies.empty);
        studiesArticleMain.appendChild(text);
    }
    studiesArticleMain.appendChild(button);
}

function _renderStudy (context) {
    var header = document.querySelector("#study header");

    // study name
    var studyName = header.querySelector("span");
    if (!studyName) {
        studyName = document.createElement("span");
        studyName.className = "renamable";
        studyName.addEventListener("mousedown", function () {
            this.setAttribute("contenteditable", true);
        });
        studyName.addEventListener("blur", function () {
            var newName = this.innerText.trim();
            eventEmitter.emit(events.RENAME_STUDY, {
                new_name: newName,
                old_name: context.current_study,
                current_test: context.current_test
            });
        });
        header.appendChild(studyName);
    }
    studyName.innerText = context.current_study;


    if (!context.current_study) {
        header.removeChild(studyName);
    }


}

function _buildStudiesSelect (context, name) {
    var studies = context.current_test_studies;
    var select = document.createElement("select");
    select.name = name;
    select.appendChild(document.createElement("option"));
    for (var studyName in studies) {
        var option = document.createElement("option");
        option.value = studyName;
        option.selected = studyName === context.current_study;
        option.innerText = studyName;
        select.appendChild(option);
    }

    select.addEventListener("change", function () {
        eventEmitter.emit(events.CHANGE_STUDY, this.value);
    });
    return select;
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
        },
        render_current_test_config: function (context) {
            _renderTestTypesSelect(context);
            _renderLangSelect(context);
            _renderForm(context, document.querySelector("#test-definition main"));
        },
        render_current_study: function (context) {
            _renderStudy(context);
            _renderForm(context, document.querySelector("#study main"));
            _renderStudies(context);
        },
        render_current_test_definition: function (context) {
            _renderForm(context, document.querySelector("#study main"));
            _renderStudy(context);
            _renderStudies(context);
        },
        render_lang_select: _renderLangSelect,
        render_current_studies: function (context) {
            _renderStudies(context);
        }
    }
};