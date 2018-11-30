// handles request delete a post
const handleDelete = (e) => {
    e.preventDefault();

    sendAjax('DELETE', $("#deletePost").attr("action"), $("#deletePost").serialize(), function(){
        redirect({redirect: '/dashboard'});
    });
};

// handles request to edit post
const handlePut = (e) =>{
    e.preventDefault();
    
    if($("#title").val() == '' || $("#description").val() == '' ||$("#body").val() == ''){
        handleError("Please fill out all fields.");
        return false;
    };

    sendAjax('PUT', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);
};

// React view to show post
const ShowPost = (props) => {
    // if there is no post, show this message
    if(!props.post){
        return(
            <div className="post">
                <p>Post Not Found</p>
            </div>)
    }

    const userURL = "/showUser?user=" + props.post.createdBy;

    // if the user is the owner of the post, give them the option to edit the post
    if(props.post.ownerID === props.id){
        return( 
            <div className="post">
                <h3 className="postTitle">{props.post.title}</h3>
                <h5 className="postCreator">Created by: <a className="userLink" href={userURL}>{props.post.createdBy}</a></h5>
                <p className="postDesc"><i>{props.post.description}</i></p>
                <p className="postBody">{props.post.body}</p>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={(e) => {createEditPostWindow(props)}}>Edit Post</button>
            </div>
        )
    }
    // otherwise, only allow users to read the post
    else{
        return(
            <div className="post">
                <h3 className="postTitle">{props.post.title}</h3>
                <h5 className="postCreator">Created by: <a className="userLink" href={userURL}>{props.post.createdBy}</a></h5>
                <p className="postDesc"><i>{props.post.description}</i></p>
                <p className="postBody">{props.post.body}</p>
                <p></p>
            </div>
        )
    }
};

// React view for editing the post
const EditPost = (props) =>{
    return(
        <div>
        <form id="postForm" 
        name="postForm" 
        onSubmit={handlePut} 
        action="/editPost" 
        method="PUT" 
        className="mainForm"
        >
            <div className="form-group row">
                Title: <input className="form-control form-control-md" id="title" type="text" name="title" defaultValue={props.post.title} placeholder="Title" maxLength="70"/>
            </div>
            <div className="form-group row">
                Description: <input type="text" className="form-control form-control-md" id="description" name="description" defaultValue={props.post.description} placeholder="Description" maxLength="150"/>
            </div>
            <div className="form-group">
                Body: <textarea className="form-control form-control-lg" id="body" name="body" rows="10" defaultValue={props.post.body} placeholder="Text here"></textarea>
            </div>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="_id" value={props.post._id}/>
            <button className="btn btn-primary btn-lg btn-block" type="submit">Save Post</button>
        </form>
        <form id="deletePost" 
        name="deletePost" 
        onSubmit={handleDelete} 
        action="/deletePost" 
        method="DELETE" 
        className="mainForm"
        >
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="_id" value={props.post._id}/>
            <button className="btn btn-danger btn-lg btn-block" type="submit">Delete Post</button>
        </form>
        </div>
    )
};

// render Edit Window
const createEditPostWindow = (props) =>{
    ReactDOM.render(
        <EditPost post={props.post} csrf={props.csrf} />, document.querySelector("#content")
    );
};

// set up method called after page loads
const setup = (csrf) =>{
    // get query from the url and remove the "?"
    const query = window.location.search.slice(1,);
    sendAjax('GET', '/getPost', query, (data) =>{
        ReactDOM.render(
            <ShowPost post={data.post} csrf={csrf} id={data.userID}/>, document.querySelector("#content")
        );
    });
};