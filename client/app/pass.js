// handles request to change password
const handleChange = (e) => {
    e.preventDefault();

    if($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('PUT', $("#changeForm").attr("action"), $("#changeForm").serialize(), 
        ReactDOM.render(<SuccessWindow />, document.querySelector('#content')));

    return false;
};

// React view for changing password
const PasswordChangeWindow = (props) => {
    return (
        <form id="changeForm" 
            name="changeForm" 
            onSubmit={handleChange} 
            action="/changePassword" 
            method="PUT" 
            className="mainForm"
        >
            <div className="form-group row">
                <label htmlFor="oldPass">Current Password: </label>
                <input className="form-control" id="oldPass" type="password" name="oldPass" placeholder="Old Password"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass">New Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="New Password"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass2">Confirm New Password: </label>
                <input className="form-control" id="pass2" type="password" name="pass2" placeholder="Confirm Password"/>
            </div>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <button className="btn btn-primary" type="submit">Change Password</button>
        </form>
    );
};

// React view for success window
const SuccessWindow = () =>{
    return(
        <div id="successful">
            <p>Password change successful!!</p>
        </div>
    );
};

// set up method called after page loads
const setup = (csrf) => {
    ReactDOM.render(
        <PasswordChangeWindow csrf={csrf} /> , document.querySelector("#content")
      );
};
