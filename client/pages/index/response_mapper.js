"use strict";

var events = require("client/events");
var mapper = {};

mapper[events.READ_USER] = function (data) {
    return data;
}

module.exports = mapper;
