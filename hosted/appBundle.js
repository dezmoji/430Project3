"use strict";

// List all posts
var PostList = function PostList(props) {
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
        // append the post id to the url
        // this allows for users to click on specific posts to view them in full 
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
                "h5",
                { className: "postCreator" },
                "Created by: ",
                post.createdBy
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
        { className: "postList" },
        postNodes
    );
};

// loads all the posts from the server
var loadPostsFromServer = function loadPostsFromServer(csrf) {
    sendAjax('GET', '/getPosts', null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts, csrf: csrf, id: data.userID }), document.querySelector("#content"));
    });
};

// set up method called after page loads
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PostList, { posts: [], csrf: csrf, id: -1 }), document.querySelector("#content"));

    // load and render the posts from the server
    loadPostsFromServer(csrf);
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