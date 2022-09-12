import React, { useState } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";

import Posts from "./Posts";

const PostsList = () => {
    const [token] = useContext(UserContext);
    const [posts, setPosts] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

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
    useEffect(() => {
        getPosts();
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
            <button className="button is-fullwidth mb-5 is-primary" onClick={ () => setActiveModal(true)}>
                Create Post</button>
            <ErrorMessage message = {errorMessage}/>
            {loaded && posts ? (
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Post Name</th>
                            <th>Post Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        { posts.map((post) => (
                            <tr key = {post.id}>
                                <td>{post.post_name}</td>
                                <td>{post.post_body}</td>
                                
                                <td>{moment(post.date_last_updated).format("MM DD YY")}</td>
                                <td>
                                    <button 
                                        className="button mr-2 is-info is-light"
                                        onClick={() => handleUpdate(post.id)}>
                                            Update
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="button mr-2 is-danger is-light" 
                                        onClick={() =>  handleDelete(post.id) }>
                                            Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ):<p>Loading..</p>}
        </>   
     );
};

export default PostsList;