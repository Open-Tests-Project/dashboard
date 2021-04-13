"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.READ_USER] = function (payload) {
    return payload;
}

module.exports = mapper;
