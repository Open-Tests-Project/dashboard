"use strict";

var events = require("client/events");

module.exports = {
    success_callback: function (event, responseMapper, eventEmitter) {
        return function (response) {
            var data = response.hasOwnProperty("data") ? response.data : response;
            if (responseMapper.hasOwnProperty(event) && typeof responseMapper[event] === "function") {
                data = responseMapper[event](data);
            }
            eventEmitter.emit(event, data);
        };
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