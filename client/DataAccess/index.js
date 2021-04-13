"use strict";

var eventEmitter = require("client/pub_sub");
var factory = require("client/DataAccess/factory");

const HTTP = "http"
const DRIVER = HTTP;

var client = require("client/drivers/" + DRIVER);

module.exports = function (responseMapper, customFactory) {

    if (customFactory && Object.keys(customFactory).length) {
        Object.assign(factory, customFactory);
    }

    return {
        exec: function (event, payload) {
            var driverOptions = factory.driver_options(DRIVER, event, payload);
            var successCallback = factory.success_callback(event, responseMapper, eventEmitter);
            var errorCallback = factory.error_callback();

            client(driverOptions)
                .then(successCallback)
                .catch(errorCallback);
        }
    };
};
