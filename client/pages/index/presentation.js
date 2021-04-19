"use strict";

var events = require("client/events");
var eventEmitter = require("client/pub_sub");

eventEmitter.on(events.READ_USER, function (data) {
    var header = document.querySelector("otp-header");
    header.user = data;
});

eventEmitter.on(events.READ_TESTS, function (data) {
    var testsArticleMain = document.querySelector("#tests main");
    var select = document.createElement("select");
    data.forEach(function (datum) {
        var option = document.createElement("option");
        option.value = datum;
        option.innerText = datum;
        select.appendChild(option);
    });
    testsArticleMain.appendChild(select);
    select.addEventListener("change", function () {
        console.log(this.value)
    })
});