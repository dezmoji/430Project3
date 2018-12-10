"use strict";

// Handler methods
var handlePost = function handlePost(e) {
    e.preventDefault();

    if ($("#title").val() == '' || $("#description").val() == '' || $("#body").val() == '') {
        handleError("Please fill out all fields.");
        return false;
    };

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);

    return false;
};

// React view for adding a post
var PostAdd = function PostAdd(props) {
    return React.createElement(
        "form",
        { id: "postForm",
            name: "postForm",
            onSubmit: handlePost,
            action: "/addPost",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group form-row" },
            "Title: ",
            React.createElement("input", { className: "form-control form-control-md", id: "title", type: "text", name: "title", placeholder: "Title", maxlength: "70" })
        ),
        React.createElement(
            "div",
            { className: "form-group form-row" },
            "Description: ",
            React.createElement("input", { type: "text", className: "form-control form-control-md", id: "description", name: "description", placeholder: "Description", maxlength: "150" })
        ),
        React.createElement(
            "div",
            { className: "form-group" },
            "Body: ",
            React.createElement("textarea", { className: "form-control form-control-lg", id: "body", name: "body", rows: "10", placeholder: "Text here" })
        ),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement(
            "button",
            { className: "btn btn-primary", type: "submit" },
            "Make Post"
        )
    );
};

// set up method called after page loads
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PostAdd, { csrf: csrf }), document.querySelector("#content"));
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