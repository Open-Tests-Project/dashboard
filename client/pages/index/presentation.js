"use strict";

var events = require("client/events");
var eventEmitter = require("client/pub_sub");
var texts = require("/texts");

eventEmitter.on(events.READ_USER_DATA_ACCESS_RESULT, function (data) {
    var header = document.querySelector("otp-header");
    header.user = data;
});

function _validateImage (image) {
    // check the type
    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.indexOf( image.type ) === -1) {
        alert("Invalid File Type");
        return false;
    }

    // check the size
    var maxSizeInBytes = 10e6; // 10MB
    if (image.size > maxSizeInBytes) {
        alert("File too large");
        return false;
    }

    return true;

}

// see https://soshace.com/the-ultimate-guide-to-drag-and-drop-image-uploading-with-pure-javascript/
function _handleFiles (files, img, actionInput) {
    files = files || [];
    for (var i = 0, len = files.length; i < len; i++) {
        var file = files[i];
        if (_validateImage(file))

            // read the image...
            var reader = new FileReader();
            reader.onload = function(event) {
            img.src = event.target.result;
            actionInput.value = file.name;
        }
        reader.readAsDataURL(file);
        // img.src = URL.createObjectURL(file);
        // img.onload = function() {
        //     URL.revokeObjectURL(this.src);
        // };
        // actionInput.value = file.name;
    }
}


function _itemActionButtonOnClick (event) {

    event.preventDefault();

    var action = event.target.getAttribute("data-action");

    var container = event.target;
    while (container.tagName !== "FIELDSET") {
        container = container.parentNode;
    }
    var select = container.querySelector("select");
    var input = container.querySelector("input");
    var img = container.querySelector("img");

    switch (action) {
        case "create-item":
            if (!input.value) {
                return;
            }
            var option = document.createElement("option");
            option.value = img.src || input.value;
            option.innerText = input.value;
            select.appendChild(option);

            return;
        case "update-item":
            if (!input.value) {
                return;
            }
            var option = select.options[select.options.selectedIndex];
            if (option) {
                option.value = img.src || input.value;
                option.innerText = input.value;
            }
            return;
        case "delete-item":
            var option = select.options[select.options.selectedIndex];
            if (option) {
                select.removeChild(option);
            }
            return;
        default:
            var selectedOption = select.options[select.options.selectedIndex];
            if (selectedOption) {
                input.value = selectedOption.innerText;
                if (selectedOption.value.slice(0, 10) === "data:image") {
                    img.src = selectedOption.value;
                } else {
                    img.src = "";
                }
            }
            return;
    }


}



function _renderForm (context, formContainer) {

    formContainer.innerHTML = null;

    if (!context.current_study && !context.current_test_readonly) {
        return;
    }

    var currentConfig = context.current_study && context.current_study.test_attributes ?
                        context.current_study.test_attributes :
                        context.current_test_definition;
    var form = document.createElement("form");
    if (!context.current_test_readonly) {
        var submitButton = document.createElement("button");
        submitButton.innerText = "Save";
        submitButton.className = "success";
        submitButton.setAttribute("data-action", "save-study");
        submitButton.addEventListener("click", function (event) {

            var data = {};
            for (var i = 0; i < form.elements.length; i += 1) {
                var element = form.elements[i];
                if (!element.name) {
                    continue;
                }
                if (element.tagName === "SELECT") {
                    data[element.name] = [];
                    for (var j = 0; j < element.options.length; j += 1) {
                        var option = element.options[j];
                        data[element.name].push({
                            value: option.value,
                            label: option.innerText
                        });
                    }
                } else {
                    data[element.name] = element.value;
                }
            }

            eventEmitter.emit(events.UPDATE_STUDY, data);

        });
        formContainer.appendChild(submitButton);


        // delete study button
        var deleteButton = document.createElement("button");
        deleteButton.innerText = texts.test_definition.button;
        deleteButton.className = "error";
        deleteButton.addEventListener("click", function (event) {
            eventEmitter.emit(events.DELETE_STUDY, context);
        });
        formContainer.appendChild(deleteButton);

    }

    var fields = Object.keys(currentConfig);

    fields.forEach(function (field) {
        var fieldContainer = document.createElement("fieldset");
        var fieldValue = currentConfig[field];
        var input;
        if (typeof fieldValue === "object") {
            input = document.createElement("select");
            input.size = 6;
            input.multiple = true;
            input.name = field;
            fieldValue.forEach(function (item) {
                var option = document.createElement("option");
                if (typeof item === "string") {
                    option.value = item;
                    option.innerText = item;
                } else {
                    option.value = item.value;
                    option.innerText = item.label;
                }
                input.appendChild(option);
            });
            if (!context.current_test_readonly) {
                input.addEventListener("click", _itemActionButtonOnClick);
                var crudContainer = document.createElement("div");
                var img = document.createElement("img");
                crudContainer.className = "crud-container";
                var actionInput = document.createElement("input");
                var dropRegion = document.createElement("div");
                dropRegion.className = "drop-region";
                dropRegion.innerText = "Drag & Drop images or click to upload";

                // open file selector when clicked on the drop region
                var fakeInput = document.createElement("input");
                fakeInput.type = "file";
                fakeInput.accept = "image/*";
                fakeInput.multiple = true;
                dropRegion.addEventListener('click', function() {
                    fakeInput.click();
                });
                dropRegion.addEventListener('dragenter', function () {
                    this.classList.add("dropping");
                }, false);
                dropRegion.addEventListener('dragleave', function () {
                    this.classList.remove("dropping");
                }, false);
                dropRegion.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }, false);
                dropRegion.addEventListener('drop', function (event) {
                    event.preventDefault();
                    this.classList.remove("dropping");
                    _handleFiles(event.dataTransfer.files, img, actionInput);
                }, false);

                fakeInput.addEventListener("change", function() {
                    _handleFiles(fakeInput.files, img, actionInput);
                });


                var createButton = document.createElement("button");
                createButton.innerText = "Add item";
                createButton.setAttribute("data-action", "create-item");
                createButton.addEventListener("click", _itemActionButtonOnClick);
                var updateButton = document.createElement("button");
                updateButton.innerText = "Update item";
                updateButton.setAttribute("data-action", "update-item");
                updateButton.addEventListener("click", _itemActionButtonOnClick);
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete item";
                deleteButton.setAttribute("data-action", "delete-item");
                deleteButton.addEventListener("click", _itemActionButtonOnClick);
                crudContainer.appendChild(actionInput);
                crudContainer.appendChild(dropRegion);
                crudContainer.appendChild(img);
                crudContainer.appendChild(createButton);
                crudContainer.appendChild(updateButton);
                crudContainer.appendChild(deleteButton);
                fieldContainer.appendChild(crudContainer);
            }

        } else {
            if (fieldValue.length >=50) {
                input = document.createElement("textarea");
            } else {
                input = document.createElement("input");
                input.type = "text";
            }
            input.value = fieldValue;
            input.name = field;
        }

        input.disabled = context.current_test_readonly;
        var label = document.createElement("label");
        label.innerText = field;
        label.appendChild(input);
        fieldContainer.appendChild(label);
        form.appendChild(fieldContainer);
    });

    formContainer.appendChild(form);
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
                study_name: newName
            });
        });
        header.appendChild(studyName);
    }
    studyName.innerText = context.current_study ? context.current_study.study_name : "";


    if (!context.current_study) {
        header.removeChild(studyName);
    }


}

function _buildStudiesSelect (context, name) {

    var studies = context.current_test_studies;
    var select = document.createElement("select");
    var currentStudyId = context.current_study ? context.current_study.study_id : "";
    select.name = name;
    select.appendChild(document.createElement("option"));
    for (var i = 0; i < studies.length; i += 1) {
        var study = studies[i];
        var studyName = study.study_name;
        var studyId = study.study_id;
        var option = document.createElement("option");
        option.value = studyId;
        //option.selected = studyName === context.current_study;
        option.selected = studyId == currentStudyId;
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