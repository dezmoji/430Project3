// handles login
const handleLogin = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username, email, or password is empty");
        return false;
    }
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

// handles signup 
const handleSignup = (e) => {
    e.preventDefault();

    if($("#email").val() == '' || $("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
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

// handles sending email for forgotten passwords
const handleForgotPass = (e) =>{
    e.preventDefault();

    if($("#email").val() == '' || $("#user").val() == ''){
        handleError("All fields required.")
        return false;
    }

    sendAjax('PUT', $("#forgotForm").attr("action"), $("#forgotForm").serialize(),
        ReactDOM.render(
            <EmailSentWindow />, document.querySelector('#content')
    ));

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
            <button className="btn btn-secondary" type="button" onClick={(e) =>{
                ReactDOM.render(
                    <ForgotPassWindow csrf={props.csrf} />,
                    document.querySelector("#content")
                 );
            }}>Forgot Password?</button>
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
                <label className="col-sm-2 col-form-label" htmlFor="email">Email: </label>
                <input className="form-control" id="email" type="email" name="email" placeholder="Email"/>
            </div>
            <div className="form-group row">
                <label htmlFor="username">Username: </label>
                <input className="form-control" id="user" type="text" name="username" placeholder="Username"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass">Password: </label>
                <input className="form-control" id="pass" type="password" name="pass" placeholder="Password"/>
            </div>
            <div className="form-group row">
                <label htmlFor="pass2">Password: </label>
                <input className="form-control" id="pass2" type="password" name="pass2" placeholder="Retype password"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>
    );
};

// React view for forgot password window
const ForgotPassWindow = (props) => {
    return (
        <div> 
            <h3>Forgot Password?</h3>
            <p>Enter your username and email to be sent a new password. It is strongly recommended that you change your password to something you will remember after logging in.</p>
            <form id="forgotForm" 
                name="forgotForm" 
                onSubmit={handleForgotPass} 
                action="/forgotPass" 
                method="PUT" 
                className="mainForm"
            >
                <div className="form-group row">
                    <label htmlFor="username">Username: </label>
                    <input className="form-control" id="user" type="text" name="username" placeholder="Username"/>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label" htmlFor="email">Email: </label>
                    <input className="form-control" id="email" type="email" name="email" placeholder="Email"/>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <button className="btn btn-primary" type="submit">Send Password</button>
            </form>
        </div>
    );
};

// React view for after the email is sent
const EmailSentWindow = () =>{
    return(
        <p>You will recieve an email shortly if the username and email combination was correct.</p>
    )
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
