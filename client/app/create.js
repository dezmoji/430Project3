// Handler methods
const handlePost = (e) => {
    e.preventDefault();

    if($("#title").val() == '' || $("#description").val() == '' ||$("#body").val() == ''){
        handleError("Please fill out all fields.");
        return false;
    };
    
    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);

    return false;
};

// React view for adding a post
const PostAdd = (props) =>{
    return(
        <form id="postForm" 
        name="postForm" 
        onSubmit={handlePost} 
        action="/addPost" 
        method="POST" 
        className="mainForm"
        >
            <div className="form-group form-row">
                Title: <input className="form-control form-control-md" id="title" type="text" name="title" placeholder="Title" maxlength="70"/>
            </div>
            <div className="form-group form-row">
                Description: <input type="text" className="form-control form-control-md" id="description" name="description" placeholder="Description" maxlength="150"/>
            </div>
            <div className="form-group">
                Body: <textarea className="form-control form-control-lg" id="body" name="body" rows="10" placeholder="Text here"></textarea>
            </div>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <button className="btn btn-primary" type="submit">Make Post</button>
        </form>
    );
};

// set up method called after page loads
const setup = (csrf) => {
    ReactDOM.render(
        <PostAdd csrf={csrf}/>, document.querySelector("#content")
    );
};
