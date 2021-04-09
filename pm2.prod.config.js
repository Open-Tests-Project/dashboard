"use strict";

var config = require("./config");

module.exports = {
    apps: [
        {
            "name": config.APP_NAME + "-http",
            "script": "./server/index.js",
            "env": {
                "NODE_ENV": "production",
            },
            "error_file": "./logs/pm2/http.error.log",
            "namespace": config.APP_NAME
        }
    ]
};