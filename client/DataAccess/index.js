"use strict";

var eventEmitter = require("client/pub_sub");
var factory = require("client/DataAccess/factory");

const HTTP = "http"
const DRIVER = HTTP;
//const DRIVER = "socket";

var client = require("client/drivers/" + DRIVER);

module.exports = function (responseMapper, customFactory) {

    if (customFactory && Object.keys(customFactory).length) {
        Object.assign(factory, customFactory);
    }

    if (DRIVER === HTTP) {
        return {
            exec: function (event, payload) {
                var driverOptions = factory.driver_options(event, payload);
                var done = factory.done(event, eventEmitter);
                var successCallback = factory.success_callback(event, responseMapper, done);
                var errorCallback = factory.error_callback();

                client(driverOptions)
                    .then(successCallback)
                    .catch(errorCallback);
            }
        };

    } else {

        return {
            exec: function (event, payload) {
                var done = factory.done(event, eventEmitter);
                var successCallback = factory.success_callback(event, responseMapper, done);
                var errorCallback = factory.error_callback();

                client.then(event, successCallback);
                client.catch(errorCallback);
                client.socket.emit(event, payload);
            }
        };
    }


};
