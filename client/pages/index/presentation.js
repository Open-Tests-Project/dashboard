"use strict";

var events = require("client/events");
var eventEmitter = require("client/pub_sub");

eventEmitter.on(events.READ_USER, function (data) {
    var header = document.querySelector("otp-header");
    console.log(header)
// header.country = "ciao";
    header.user = data;
// console.log(header)

});