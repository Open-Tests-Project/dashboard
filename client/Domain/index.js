"use strict";

var DataAccess = require("client/DataAccess/index");

module.exports = function (requestMapper, responseMapper, dataAccessFactory) {
    var dataAccess = DataAccess(responseMapper, dataAccessFactory);
    return {
        exec: function (event, payload) {
            if (requestMapper.hasOwnProperty(event) && typeof requestMapper[event] === "function") {
                payload = requestMapper[event](payload);
            }
            dataAccess.exec(event, payload);
        }
    };
};