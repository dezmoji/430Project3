"use strict";

// handles login
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// handles signup 
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// React view for login window
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { className: "col-sm-2 col-form-label", htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { className: "form-control", id: "user", type: "text", name: "username", placeholder: "username" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { className: "col-sm-2 col-form-label", htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass", type: "password", name: "pass", placeholder: "password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { className: "btn btn-primary", type: "submit" },
            "Sign In"
        )
    );
};

// React view for signup window
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { className: "form-control", id: "user", type: "text", name: "username", placeholder: "username" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass", type: "password", name: "pass", placeholder: "password" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass2", type: "password", name: "pass2", placeholder: "retype password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { className: "btn btn-primary", type: "submit" },
            "Sign Up"
        )
    );
};

// render React view for login window
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

//  render React view for signup window
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// set up method called after page loads
var setup = function setup(csrf) {
    // set up buttons and events
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    // render the login window
    createLoginWindow(csrf);
};

var AlertWindow = function AlertWindow(props) {
    return React.createElement(
        "div",
        { className: "alert alert-danger alert-dismissible fade show", id: "alert", role: "alert" },
        React.createElement(
            "p",
            { id: "errorMessage" },
            props.message
        ),
        React.createElement(
            "button",
            { type: "button", className: "close", "data-dismiss": "alert", onClick: function onClick() {
                    return $('#alert').remove();
                }, "aria-label": "Close" },
            React.createElement(
                "span",
                { "aria-hidden": "true" },
                "\xD7"
            )
        )
    );
};

var handleError = function handleError(message) {
    ReactDOM.render(React.createElement(AlertWindow, { message: message }), document.querySelector("#error"));
    return false;
};

// redirects the window location
var redirect = function redirect(response) {
    window.location = response.redirect;
};

// send ajax request 
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// get a token
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        // call the setup method in bundle
        setup(result.csrfToken);
    });
};

// get token after page loads
$(document).ready(function () {
    getToken();
});