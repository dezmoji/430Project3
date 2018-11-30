"use strict";

// React view for user
var UserPosts = function UserPosts(props) {
    // if there are no posts
    if (props.posts.length === 0) {
        return React.createElement(
            "div",
            { className: "post" },
            React.createElement(
                "h3",
                null,
                "No posts yet"
            )
        );
    }

    // set up post
    var postNodes = props.posts.map(function (post) {
        // append id's to thr url's 
        var postURL = "/showPost?postID=" + post._id;
        return React.createElement(
            "div",
            { key: post._id, className: "post" },
            React.createElement(
                "h3",
                { className: "postTitle" },
                React.createElement(
                    "b",
                    null,
                    post.title
                )
            ),
            React.createElement(
                "p",
                { className: "postDesc" },
                React.createElement(
                    "i",
                    null,
                    post.description
                )
            ),
            React.createElement(
                "a",
                { className: "postLink", href: postURL },
                "Read more..."
            )
        );
    });

    // return the posts
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            "Posts created by: "
        ),
        React.createElement(
            "div",
            { className: "postList" },
            postNodes
        )
    );
};

// 
var setup = function setup(csrf) {
    // get query from the url and remove the "?"
    var query = window.location.search.slice(1);

    console.log('hit');

    sendAjax('GET', '/getUserPosts', query, function (data) {
        ReactDOM.render(React.createElement(UserPosts, { posts: data.posts, csrf: csrf }), document.querySelector("#content"));
    });
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