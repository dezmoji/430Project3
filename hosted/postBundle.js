"use strict";

// handles request delete a post
var handleDelete = function handleDelete(e) {
    e.preventDefault();

    sendAjax('DELETE', $("#deletePost").attr("action"), $("#deletePost").serialize(), function () {
        redirect({ redirect: '/dashboard' });
    });
};

// handles request to edit post
var handlePut = function handlePut(e) {
    e.preventDefault();

    if ($("#title").val() == '' || $("#description").val() == '' || $("#body").val() == '') {
        handleError("Please fill out all fields.");
        return false;
    };

    sendAjax('PUT', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);
};

// React view to show post
var ShowPost = function ShowPost(props) {
    // if there is no post, show this message
    if (!props.post) {
        return React.createElement(
            "div",
            { className: "post" },
            React.createElement(
                "p",
                null,
                "Post Not Found"
            )
        );
    }

    var userURL = "/showUser?user=" + props.post.createdBy;

    // if the user is the owner of the post, give them the option to edit the post
    if (props.post.ownerID === props.id) {
        return React.createElement(
            "div",
            { className: "post" },
            React.createElement(
                "h3",
                { className: "postTitle" },
                props.post.title
            ),
            React.createElement(
                "h5",
                { className: "postCreator" },
                "Created by: ",
                React.createElement(
                    "a",
                    { className: "userLink", href: userURL },
                    props.post.createdBy
                )
            ),
            React.createElement(
                "p",
                { className: "postDesc" },
                React.createElement(
                    "i",
                    null,
                    props.post.description
                )
            ),
            React.createElement(
                "p",
                { className: "postBody" },
                props.post.body
            ),
            React.createElement(
                "button",
                { type: "button", className: "btn btn-primary btn-lg btn-block", onClick: function onClick(e) {
                        createEditPostWindow(props);
                    } },
                "Edit Post"
            )
        );
    }
    // otherwise, only allow users to read the post
    else {
            return React.createElement(
                "div",
                { className: "post" },
                React.createElement(
                    "h3",
                    { className: "postTitle" },
                    props.post.title
                ),
                React.createElement(
                    "h5",
                    { className: "postCreator" },
                    "Created by: ",
                    React.createElement(
                        "a",
                        { className: "userLink", href: userURL },
                        props.post.createdBy
                    )
                ),
                React.createElement(
                    "p",
                    { className: "postDesc" },
                    React.createElement(
                        "i",
                        null,
                        props.post.description
                    )
                ),
                React.createElement(
                    "p",
                    { className: "postBody" },
                    props.post.body
                ),
                React.createElement("p", null)
            );
        }
};

// React view for editing the post
var EditPost = function EditPost(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "postForm",
                name: "postForm",
                onSubmit: handlePut,
                action: "/editPost",
                method: "PUT",
                className: "mainForm"
            },
            React.createElement(
                "div",
                { className: "form-group row" },
                "Title: ",
                React.createElement("input", { className: "form-control form-control-md", id: "title", type: "text", name: "title", defaultValue: props.post.title, placeholder: "Title", maxLength: "70" })
            ),
            React.createElement(
                "div",
                { className: "form-group row" },
                "Description: ",
                React.createElement("input", { type: "text", className: "form-control form-control-md", id: "description", name: "description", defaultValue: props.post.description, placeholder: "Description", maxLength: "150" })
            ),
            React.createElement(
                "div",
                { className: "form-group" },
                "Body: ",
                React.createElement("textarea", { className: "form-control form-control-lg", id: "body", name: "body", rows: "10", defaultValue: props.post.body, placeholder: "Text here" })
            ),
            React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
            React.createElement("input", { type: "hidden", name: "_id", value: props.post._id }),
            React.createElement(
                "button",
                { className: "btn btn-primary btn-lg btn-block", type: "submit" },
                "Save Post"
            )
        ),
        React.createElement(
            "form",
            { id: "deletePost",
                name: "deletePost",
                onSubmit: handleDelete,
                action: "/deletePost",
                method: "DELETE",
                className: "mainForm"
            },
            React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
            React.createElement("input", { type: "hidden", name: "_id", value: props.post._id }),
            React.createElement(
                "button",
                { className: "btn btn-danger btn-lg btn-block", type: "submit" },
                "Delete Post"
            )
        )
    );
};

// render Edit Window
var createEditPostWindow = function createEditPostWindow(props) {
    ReactDOM.render(React.createElement(EditPost, { post: props.post, csrf: props.csrf }), document.querySelector("#content"));
};

// set up method called after page loads
var setup = function setup(csrf) {
    // get query from the url and remove the "?"
    var query = window.location.search.slice(1);
    sendAjax('GET', '/getPost', query, function (data) {
        ReactDOM.render(React.createElement(ShowPost, { post: data.post, csrf: csrf, id: data.userID }), document.querySelector("#content"));
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