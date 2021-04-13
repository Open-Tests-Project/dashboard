"use strict";

var dataAccess = require("client/data_access/index");

module.exports = function (requestMapper) {
    return {
        exec: function (event, payload) {
            if (requestMapper.hasOwnProperty(event) && typeof requestMapper[event] === "function") {
                payload = requestMapper[event](payload);
            }
            dataAccess.exec(event, payload);
        }
    };
};