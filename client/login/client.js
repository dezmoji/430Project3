// handles login
const handleLogin = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

// handles signup 
const handleSignup = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// React view for login window
const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm" 
            onSubmit={handleLogin} 
            action="/login" 
            method="POST" 
            className="mainForm"
        >
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="username">Username: </label>
                <input className="form-control" id="user" type="text" name="username" placeholder="username"/>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor="pass">Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="password"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button className="btn btn-primary" type="submit">Sign In</button>
        </form>
    );
};

// React view for signup window
const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm" 
            onSubmit={handleSignup} 
            action="/signup" 
            method="POST" 
            className="mainForm"
        >
            <div className="form-group row">
                <label htmlFor="username">Username: </label>
                <input className="form-control" id="user" type="text" name="username" placeholder="username"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass">Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="password"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass2">Password: </label>
                <input className="form-control" id="pass2" type="password" name="pass2" placeholder="retype password"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>
    );
};

// render React view for login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//  render React view for signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// set up method called after page loads
const setup = (csrf) => {
    // set up buttons and events
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    // render the login window
    createLoginWindow(csrf);
};
