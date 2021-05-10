"use strict";



class Component extends HTMLElement {
    constructor() {
        super();
        this.nav = document.createElement("nav");

        // this._shadowRoot = this.attachShadow({ mode: "open" });
        // this._shadowRoot.appendChild(this.nav);

        // or

        this.appendChild(this.nav);

        this.user = {};
    }

    static get observedAttributes() {
        return ["user", "message"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // name will always be "country" due to observedAttributes
        // this.country = newValue;
        // console.log(name, oldValue, newValue)
        this.render();
    }
    connectedCallback() {
        this.render();
    }


    get user() {
        var user = this.getAttribute("user");
        try {
            return JSON.parse(user);
        } catch (e) {
            return user;
        }
    }
    set user(v) {
        try {
            this.setAttribute("user", JSON.stringify(v));
        } catch (e) {
            this.setAttribute("user", v);
        }
    }
    get message() {
        return this.getAttribute("message");
    }
    set message (message) {
        this.setAttribute("message", message);
    }

    render() {
        // console.log("####", this.message)
        this.nav.innerHTML = "";
        // Left as an exercise for the reader. But, you'll probably want to
        // check this.ownerDocument.defaultView to see if we've been
        // inserted into a document with a browsing context, and avoid
        // doing any work if not.
        var h5 = document.createElement("h5");
        h5.innerText = "OTP";
        this.nav.appendChild(h5);
        var user = this.user;

        if (user.email) {
            var userText = document.createTextNode(user.email);
            var roleText = document.createTextNode("[" + user.role + "]");

            var logout = document.createElement("a");
            logout.innerText = "Logout";
            logout.href =  `${BASE_URL}/api/logout/web?returnTo=${BASE_URL}/auth/signin/`;

            this.nav.appendChild(userText);
            this.nav.appendChild(roleText);
            this.nav.appendChild(logout);
        }


        if (this.message) {
            var message = document.createElement("span");
            message.className = "message";
            message.innerText = this.message;
            this.nav.appendChild(message);
        }
    }
}

module.exports = Component;