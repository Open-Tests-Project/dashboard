"use strict";

var shared = require("/shared");

module.exports = {
    success_callback: function (event, responseMapper, done) {
        return function (response) {
            var data = response.hasOwnProperty("data") ? response.data : response;
            if (responseMapper.hasOwnProperty(event) && typeof responseMapper[event] === "function") {
                data = responseMapper[event](data);
            }
            done(data);
        };
    },
    done: function (event, eventEmitter) {
        return function (data) {
            console.log(event + shared.DATA_ACCESS_RESULT)
            eventEmitter.emit(event + shared.DATA_ACCESS_RESULT, data);
        }
    },
    error_callback: function () {
        return function (error) {
            console.log(error);
        };
    },

    driver_options: function (event, payload) {
        var options = {};
        return options;
    }
};