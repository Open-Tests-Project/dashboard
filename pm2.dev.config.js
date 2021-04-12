"use strict";

var config = require("./config");

module.exports = {
  apps: [
    {
      "name": "dev:" + config.APP_NAME + "-watch-assets",
      "script": "npm",
      "args": ["run", "watch"],
      "error_file": "./logs/pm2/dev_assets.error.log",
      "namespace": config.APP_NAME
    },
    {
      "name": "dev:" + config.APP_NAME + "-http-server",
      "script": "./node_modules/.bin/nodemon ./server/index.js --config nodemon.json",
      "error_file": "./logs/pm2/dev_http.error.log",
      "watch" : false,
      "namespace": config.APP_NAME
    }
  ]
};