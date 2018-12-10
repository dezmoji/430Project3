// React view for user
const UserInfo = (props) =>{
    if(!props.user) redirect('/dashboard');

    const postsURL = "/showUserPosts?ownerID=" + props.user._id;
    console.log(props.user);
    return(
        <div>
            <h3>{props.user.username}</h3>
            <h5><a href={postsURL}>View this users posts</a></h5>
            <h5>About: </h5>
            <p>{props.user.about}</p> 
        </div>
    );
};

// required setup function
const setup = (csrf) =>{
    // get query from the url and remove the "?"
    const query = window.location.search.slice(1,);
    sendAjax('GET', '/getUser', query, (data) =>{
        ReactDOM.render(
        <UserInfo user={data.user} csrf={csrf}/>, document.querySelector("#content")
        );
    });
};