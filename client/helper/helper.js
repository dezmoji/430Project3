// React view for the alert 
const AlertWindow = (props) =>{
    return (
        <div className="alert alert-danger alert-dismissible fade show"  id="alert" role="alert">
            <p id="errorMessage">{props.message}</p>
            <button type="button" className="close" data-dismiss="alert" onClick={() => $('#alert').remove()} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

// handles errors by showing an alert with a message
const handleError = (message) =>{
    ReactDOM.render(
        <AlertWindow message={message} />, document.querySelector("#error")
    );
    return false;
};

// redirects the window location
const redirect = (response) => {
    window.location = response.redirect;
};

// send ajax request 
const sendAjax = (type, action, data, success) =>{
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// get a token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        // call the setup method in bundle
        setup(result.csrfToken);
    });
};

// get token after page loads
$(document).ready(function() {
    getToken();
});