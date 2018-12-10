"use strict";

// handles request to update account
var handlePut = function handlePut(e) {
    e.preventDefault();

    sendAjax('PUT', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
};

// React view for account form
var AccountForm = function AccountForm(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "accountForm",
                name: "accountForm",
                onSubmit: handlePut,
                action: "/editAccount",
                method: "PUT",
                className: "mainForm" },
            React.createElement(
                "div",
                { className: "form-group row" },
                "Username: ",
                React.createElement("input", { className: "form-control form-control-md form-control-plaintext", readonly: true, id: "username", type: "text", name: "username", defaultValue: props.user.username, placeholder: "Username" })
            ),
            React.createElement(
                "div",
                { className: "form-group row" },
                "Email: ",
                React.createElement("input", { className: "form-control form-control-md", id: "email", type: "email", name: "email", defaultValue: props.user.email, placeholder: "Email", required: true })
            ),
            React.createElement(
                "div",
                { className: "form-group row" },
                "About: ",
                React.createElement("textarea", { className: "form-control form-control-md", id: "about", name: "about", rows: "10", defaultValue: props.user.about, placeholder: "Tell us about yourself" })
            ),
            React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
            React.createElement(
                "button",
                { className: "btn btn-primary btn-sm btn-block", type: "submit" },
                "Update Account"
            )
        ),
        React.createElement("br", null),
        React.createElement(
            "button",
            { type: "button", className: "btn btn-primary btn-md btn-block", onClick: function onClick(e) {
                    window.location = "/changePass";
                } },
            "Change Password?"
        ),
        React.createElement(
            "button",
            { type: "button", className: "btn btn-primary btn-md btn-block", onClick: function onClick(e) {
                    console.log('hello');window.location = "/showUserPosts";
                } },
            "View Your Posts"
        )
    );
};

// required setup function
var setup = function setup(csrf) {
    sendAjax('GET', '/getAccount', null, function (data) {
        ReactDOM.render(React.createElement(AccountForm, { user: data.user, csrf: csrf }), document.querySelector("#content"));
    });
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