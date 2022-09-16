import React, { useState } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";

import Posts from "./Posts";
import Comments from "./Comments";

const PostsList = () => {
    const [token] = useContext(UserContext);
    const [posts, setPosts] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);
    const [comments, setComments] = useState([]);

    const handleUpdate = async (id) => {
        setId(id);
        setActiveModal(true);
    };

const handleDelete = async (id) => {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch(`/api/posts/${id}`, requestOptions);
    if (!response.ok) {
        setErrorMessage("Failed to delete post");
    }
    getPosts();
};

    const getPosts = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("/api/posts", requestOptions);
        
        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the posts");
            
        } else {
            const data = await response.json();
            setPosts(data);
            setLoaded(true);
        }
    };

    const getComments = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("/api/comments", requestOptions);
        
        if (!response.ok) {
            setErrorMessage("Something went wrong. Couldn't load the posts");
            
        } else {
            const data = await response.json();
            setComments(data);
            setLoaded(true);
        }
    };

    console.log(comments)
    console.log(posts)
    useEffect(() => {
        getPosts();
        getComments();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getPosts();
        setId(null);
    };

    return( 
        <>
            <Posts 
                active={activeModal} 
                handleModal={handleModal} 
                token={token} 
                id={id}
                setErrorMessage={setErrorMessage}
             />
            <button className="button is-fullwidth mb-5 is-primary" onClick={ () => setActiveModal(true)}>Create Post</button>
            <ErrorMessage message = {errorMessage}/>
            {loaded && posts ? (
                    <div class="container">                                              
                        <section class="articles">
                            <div class="column is-8 is-offset-2">                        
                                <div class="card article">
                                    <div class="card-content">
                                    { posts.map((post) => (
                                        <div key = {post.id}>
                                            <div class="media">
                                                <div class="media-content has-text-centered">
                                                    <p class="title article-title">{post.post_name}</p>
                                                    <div class="tags has-addons level-item">
                                                        <span class="tag is-rounded is-info">@{post.owner_id}</span>
                                                        <span class="tag is-rounded">May 10, 202X</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="content article-body">
                                                <p>Non arcu risus quis varius quam quisque. Dictum varius duis at consectetur lorem. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. </p>                                                
                                                <p>{post.post_body}</p>
                                            </div>
                                            <button 
                                                className="button mr-2 is-danger is-light" 
                                                onClick={() =>  handleDelete(post.id) }>
                                                    Delete
                                            </button>
                                            <button 
                                                className="button mr-2 is-info is-light"
                                                onClick={() => handleUpdate(post.id)}>
                                                    Update
                                            </button>
                                            
                                            {/*    { post.id  === comments[0].post_id ? (
                                                    <div>
                                                        <Comments/>
                                                    </div>
                                                ):<p>Loading..</p>}
                                            */}
                                            <Comments postId={post.id}/>

                                        </div>
                                     ))}
                                    </div>
                                </div>
                            </div>
                        </section> 
                    </div>   
            ):<p>Loading..</p>}

        </>   
     );
};

export default PostsList;