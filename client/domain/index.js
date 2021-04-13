"use strict";


var requestMapper = require("client/domain/request_mapper");
var dataAccess = require("client/data_access/index");

module.exports = {
    exec: function (event, payload) {
        if (requestMapper.hasOwnProperty(event) && typeof requestMapper[event] === "function") {
            payload = requestMapper[event](payload);
        }
        dataAccess.exec(event, payload);
    }
};