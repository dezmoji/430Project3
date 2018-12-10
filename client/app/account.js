const handlePost = (e) => {
    e.preventDefault();

    sendAjax('PUT', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect)
};

const AccountForm = (props) => {
    return(
        <div>
            <form id="accountForm" 
            name="accountForm" 
            onSubmit={handlePost} 
            action="/editAccount" 
            method="PUT" 
            className="mainForm">
                <div className="form-group row">
                    Username: <input className="form-control form-control-md form-control-plaintext" readonly id="username" type="text" name="username" defaultValue={props.user.username} placeholder="Username"/>
                </div>
                <div className="form-group row">
                    About: <textarea className="form-control form-control-md" id="about" name="about" rows="10" defaultValue={props.user.about} placeholder="Tell us about yourself"></textarea>
                </div>
                <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                <button className="btn btn-primary btn-sm btn-block" type="submit">Update Account</button>
            </form>
            <br />
            <button type="button" className="btn btn-primary btn-md btn-block" onClick={(e) => {window.location = "/changePass"}}>Change Password?</button>
            <button type="button" className="btn btn-primary btn-md btn-block" onClick={(e) => {console.log('hello'); window.location = "/showUserPosts"}}>View Your Posts</button>
        </div>
    );
};


const setup = (csrf) =>{
    sendAjax('GET', '/getAccount', null, (data) =>{
        ReactDOM.render(
            <AccountForm user={data.user} csrf={csrf}/>, document.querySelector("#content")
        )
    });
};