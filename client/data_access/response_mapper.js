"use strict";


var events = require("client/events");
var mapper = {};

mapper[events.READ_USER] = function (response) {
    return response;
}

module.exports = mapper;
