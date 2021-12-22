"use strict";

// load components
require("client/components/index");
var presentation = require("client/pages/index/presentation");
var events = require("client/events");
var eventEmitter = require("client/pub_sub");
var Machine = require("client/pages/index/xstate/index").default;
var Mover = require("client/pages/index/mover");
var requestMapper = require("client/pages/index/request_mapper");
var responseMapper = require("client/pages/index/response_mapper");
var dataAccessFactory = require("client/pages/index/data_access_factory");
var Router = require("client/pages/index/router");
var Domain = require("client/Domain/index");
var domain = Domain(requestMapper, responseMapper, dataAccessFactory);
domain.exec(events.READ_USER);

const domainActions = {
    start_loading_tests: function () {
        domain.exec(events.READ_TESTS);
    },
    start_loading_current_test: function (context) {
        domain.exec(events.READ_TEST, context);
    },
    start_loading_current_studies: function (context) {
        domain.exec(events.READ_STUDIES, context);
    },
    start_creating_study: function (context) {
        domain.exec(events.CREATE_STUDY, context);
    },
    start_deleting_study: function (context, event) {
        domain.exec(events.DELETE_STUDY, {
            study_name: event.study_to_be_deleted,
            test_name: context.current_test
        });
    },
    start_renaming_study: function (context, event) {
        domain.exec(events.RENAME_STUDY, {
            new_name: event.new_name,
            old_name: event.old_name,
            current_test: event.current_test
        });
    },
    start_updating_study: function (context, event) {
        domain.exec(events.UPDATE_STUDY, {
            data: event.data,
            current_test: context.current_test
        });
    }

}
var machineInstance = Machine({
    actions: Object.assign({}, presentation.actions, domainActions)
});
var router = Router(machineInstance);
machineInstance.start();
machineInstance.send("LOAD_TESTS");
machineInstance.onTransition(function (state) {
    // if the state is changed, do actions with side effect
    if (state.changed) {
        // todo simone dev
        // console.log(state.value, state.context);
    }

    if (state.value === "idle") {
        router.init();
    }
});



eventEmitter.on(events.READ_TESTS_DATA_ACCESS_RESULT, function (data) {
    machineInstance.send("RESOLVE", {data});
});
eventEmitter.on(events.READ_TEST_DATA_ACCESS_RESULT, function (data) {
    machineInstance.send("RESOLVE", {data});
});
eventEmitter.on(events.CHANGE_TEST, function (test) {
    machineInstance.send(events.CHANGE_TEST, {
        current_test_type: test
    });
});
eventEmitter.on(events.CHANGE_STUDY, function (study) {
    router.redirect('/study/' + router.buildParam(study));
});
eventEmitter.on(events.CHANGE_LANG, function (lang) {
    machineInstance.send(events.CHANGE_LANG, {
        current_test_lang: lang
    });
});
eventEmitter.on(events.CREATE_STUDY_DATA_ACCESS_RESULT, function (data) {
    router.redirect('/study/' + router.buildParam(data));
    machineInstance.send("RESOLVE", {data});
});
eventEmitter.on(events.CREATE_STUDY, function () {
    machineInstance.send("CREATE_STUDY");
});
eventEmitter.on(events.DELETE_STUDY_DATA_ACCESS_RESULT, function (data) {
    router.redirect('/study/' + router.buildParam(data));
    machineInstance.send("RESOLVE", {data});
});
eventEmitter.on(events.DELETE_STUDY, function (studyName) {
    machineInstance.send(events.DELETE_STUDY, {
        study_to_be_deleted: studyName
    });
});

eventEmitter.on(events.RENAME_STUDY, function (payload) {
    machineInstance.send(events.RENAME_STUDY, payload);
});
eventEmitter.on(events.RENAME_STUDY_DATA_ACCESS_RESULT, function (data) {
    machineInstance.send("RESOLVE", {data});
});

eventEmitter.on(events.UPDATE_STUDY, function (data) {
    machineInstance.send(events.UPDATE_STUDY, {data});
});

eventEmitter.on(events.READ_STUDIES_DATA_ACCESS_RESULT, function (data) {
    machineInstance.send("RESOLVE", {data});
});



function initLayout () {

    function getArticles () {
        return document.querySelectorAll("article");
    }

    var main = document.querySelector("main");
    [].forEach.call(getArticles(), function (article) {

        var computedStyle = getComputedStyle(article);
        article.style.left = (article.offsetLeft - parseInt(computedStyle.marginLeft, 10)) + "px";
        article.style.top = article.offsetTop + "px";

    });

    var moverCollection = [];

    document.querySelector('input[name="move"]').addEventListener("change", function () {
        var checked = this.checked;

        moverCollection.forEach(function (mover) {
            mover.stop();
        });
        moverCollection.length = 0;
        [].forEach.call(getArticles(), function (article) {
            var mover = Mover(article, main);
            moverCollection.push(mover);

            if (checked) {
                // article.style.position = "absolute";
                article.classList.add("draggable");
                mover.start();
            } else {
                // article.style.position = "static";
                article.classList.remove("draggable");
                mover.stop();
            }

        });
    });

}

window.addEventListener("load", initLayout);
