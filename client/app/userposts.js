// React view for user
const UserPosts = (props) =>{
    // if there are no posts
    if(props.posts.length === 0){
        return(
            <div className="post">
                <h3>No posts yet</h3>
            </div>
        );
    }

    // set up post
    const postNodes = props.posts.map(function(post){
        // append id's to thr url's 
        const postURL = "/showPost?postID=" + post._id;
        return (
            <div key={post._id} className="post">
                <h3 className="postTitle"><b>{post.title}</b></h3>
                <p className="postDesc"><i>{post.description}</i></p>
                <a className="postLink" href={postURL}>Read more...</a>
            </div>
        )
    });

    // return the posts
    return (
        <div>
            <h3>Posts created by: {props.createdBy}</h3>
            <div className="postList">
             {postNodes}
            </div>
        </div>
    )
};

// 
const setup = (csrf) =>{
    // get query from the url and remove the "?"
    const query = window.location.search.slice(1,);

    sendAjax('GET', '/getUserPosts', query, (data) =>{
        ReactDOM.render(
            <UserPosts posts={data.posts} csrf={csrf} createdBy={data.createdBy}/>, document.querySelector("#content")
        );
    });
};