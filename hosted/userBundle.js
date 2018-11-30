'use strict';

// React view for user
var UserInfo = function UserInfo(props) {
    if (!props.user) redirect('/dashboard');

    var postsURL = "/showUserPosts?ownerID=" + props.user._id;
    console.log(props.user);
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h3',
            null,
            props.user.username
        ),
        React.createElement(
            'h5',
            null,
            React.createElement(
                'a',
                { href: postsURL },
                'View this users posts'
            )
        ),
        React.createElement(
            'h5',
            null,
            'About: '
        ),
        React.createElement(
            'p',
            null,
            props.user.about
        )
    );
};

// 
var setup = function setup(csrf) {
    // get query from the url and remove the "?"
    var query = window.location.search.slice(1);
    sendAjax('GET', '/getUser', query, function (data) {
        ReactDOM.render(React.createElement(UserInfo, { user: data.user, csrf: csrf }), document.querySelector("#content"));
    });
};
var AlertWindow = function AlertWindow(props) {
    return React.createElement(
        'div',
        { className: 'alert alert-danger alert-dismissible fade show', id: 'alert', role: 'alert' },
        React.createElement(
            'p',
            { id: 'errorMessage' },
            props.message
        ),
        React.createElement(
            'button',
            { type: 'button', className: 'close', 'data-dismiss': 'alert', onClick: function onClick() {
                    return $('#alert').remove();
                }, 'aria-label': 'Close' },
            React.createElement(
                'span',
                { 'aria-hidden': 'true' },
                '\xD7'
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