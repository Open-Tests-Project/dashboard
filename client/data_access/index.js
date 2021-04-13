"use strict";

var eventEmitter = require("client/pub_sub");
var responseMapper = require("client/data_access/response_mapper");
var factory = require("client/data_access/factory");

const HTTP = "http"
const DRIVER = HTTP;

var client = require("client/drivers/" + DRIVER);


function _execFactory (driver) {
    if (driver === HTTP) {
        return function (event, payload) {

        }
    }
}
function _successCallbackFactory (driver) {
    if (driver === HTTP) {
        return function (event, payload) {

        }
    }
}
function _errorCallbackFactory (driver) {
    return function (error, payload) {
        console.log(error);
    }
}


module.exports = {
    exec: function (event, payload) {

        var driverOptions = factory.driver_options(DRIVER, event, payload);


        var successCallback = function (response) {
            var data = response.data;
            if (responseMapper.hasOwnProperty(event) && typeof responseMapper[event] === "function") {
                data = responseMapper[event](data);
            }
            eventEmitter.emit(event, data);
        };
        var errorCallback = function (error, payload) {
            console.log(error);
        };

        client(driverOptions)
            .then(successCallback)
            .catch(errorCallback);
    }
};
