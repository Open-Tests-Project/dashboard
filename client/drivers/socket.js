"use strict";

const shared = require("/shared");
const io = require("socket.io-client");
const socket = io(BASE_URL, {
    "path": "/socket.io/api"
});

socket.on("connect", function () {
    console.log("connect to socket id: " + socket.id);
});
socket.on("reconnect_attempt", function () {
    console.log("reconnect_attempt");
});

var registeredEvents = [];

module.exports = {
    io: io,
    socket: socket,
    then: function (requestEvent, callback) {
        var responseEvent = requestEvent + shared.DATA_ACCESS_RESULT;
        if (registeredEvents.indexOf(responseEvent) === -1) {
            registeredEvents.push(responseEvent);
            socket.on(responseEvent, callback);
        }
    },
    catch: function (errorCallback) {
        var event = "connect_error";
        if (registeredEvents.indexOf(event) === -1) {
            registeredEvents.push(event);
            socket.on(event, errorCallback);
        }
    }
};