"use strict";

// handles request to change password
var handleChange = function handleChange(e) {
    e.preventDefault();

    if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('PUT', $("#changeForm").attr("action"), $("#changeForm").serialize(), ReactDOM.render(React.createElement(SuccessWindow, null), document.querySelector('#content')));

    return false;
};

// React view for changing password
var PasswordChangeWindow = function PasswordChangeWindow(props) {
    return React.createElement(
        "form",
        { id: "changeForm",
            name: "changeForm",
            onSubmit: handleChange,
            action: "/changePassword",
            method: "PUT",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "oldPass" },
                "Current Password: "
            ),
            React.createElement("input", { className: "form-control", id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "New Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass", type: "password", name: "pass", placeholder: "New Password" })
        ),
        React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "Confirm New Password: "
            ),
            React.createElement("input", { className: "form-control", id: "pass2", type: "password", name: "pass2", placeholder: "Confirm Password" })
        ),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { className: "btn btn-primary", type: "submit" },
            "Change Password"
        )
    );
};

// React view for success window
var SuccessWindow = function SuccessWindow() {
    return React.createElement(
        "div",
        { id: "successful" },
        React.createElement(
            "p",
            null,
            "Password change successful!!"
        )
    );
};

// set up method called after page loads
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PasswordChangeWindow, { csrf: csrf }), document.querySelector("#content"));
};

// React view for the alert 
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

// handles errors by showing an alert with a message
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