"use strict";

// handles login
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username, email, or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// handles signup 
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    if ($("#email").val() == '' || $("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
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

var handleForgotPass = function handleForgotPass(e) {
    e.preventDefault();

    if ($("#email").val() == '' || $("#user").val() == '') {
        handleError("All fields required.");
        return false;
    }

    sendAjax('PUT', $("#forgotForm").attr("action"), $("#forgotForm").serialize(), ReactDOM.render(React.createElement(EmailSentWindow, null), document.querySelector('#content')));

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
        ),
        React.createElement(
            "button",
            { className: "btn btn-secondary", type: "button", onClick: function onClick(e) {
                    ReactDOM.render(React.createElement(ForgotPassWindow, { csrf: props.csrf }), document.querySelector("#content"));
                } },
            "Forgot Password?"
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
                { className: "col-sm-2 col-form-label", htmlFor: "email" },
                "Email: "
            ),
            React.createElement("input", { className: "form-control", id: "email", type: "email", name: "email", placeholder: "Email" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { className: "form-control", id: "user", type: "text", name: "username", placeholder: "Username" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass", type: "password", name: "pass", placeholder: "Password" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass2", type: "password", name: "pass2", placeholder: "Retype password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { className: "btn btn-primary", type: "submit" },
            "Sign Up"
        )
    );
};

// React view for forgot password window
var ForgotPassWindow = function ForgotPassWindow(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            "Forgot Password?"
        ),
        React.createElement(
            "p",
            null,
            "Enter your username and email to be sent a new password. It is strongly recommended that you change your password to something you will remember after logging in."
        ),
        React.createElement(
            "form",
            { id: "forgotForm",
                name: "forgotForm",
                onSubmit: handleForgotPass,
                action: "/forgotPass",
                method: "PUT",
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
                React.createElement("input", { className: "form-control", id: "user", type: "text", name: "username", placeholder: "Username" })
            ),
            React.createElement(
                "div",
                { className: "form-group row" },
                React.createElement(
                    "label",
                    { className: "col-sm-2 col-form-label", htmlFor: "email" },
                    "Email: "
                ),
                React.createElement("input", { className: "form-control", id: "email", type: "email", name: "email", placeholder: "Email" })
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "button",
                { className: "btn btn-primary", type: "submit" },
                "Send Password"
            )
        )
    );
};

var EmailSentWindow = function EmailSentWindow() {
    return React.createElement(
        "p",
        null,
        "You will recieve an email shortly if the username and email combination was correct."
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