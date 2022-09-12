import React, { useState } from "react";
import { useEffect } from "react";

const Posts = ({active, handleModal, token, id, setErrorMessage }) => {
    const [postName, setPostName] = useState("");
    const [postBody, setPostBody] = useState("");
    

    const cleanFormData = () => {
        setPostName("");
        setPostBody("");    
    };

    useEffect(() => {
        const getPost = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`/api/posts/${id}`, requestOptions);
            if (!response.ok) {
                setErrorMessage("Can't get the post")
            } else {
                const data = await response.json();
                setPostName(data.post_name);
                setPostBody(data.post_body);
            }
        };
        if (id) {
            getPost();
        }
    }, [id, token]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                post_name: postName, 
                post_body: postBody, 
            }),
            
        };
        const response = await fetch("/api/posts", requestOptions)
        if (!response.ok) {
            setErrorMessage("Something went wrong when creating a post");
        } else {
            cleanFormData();
            handleModal();
        }
    }

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                post_name: postName, 
                post_body: postBody,  
                
            }),
        };
        const response = await fetch(`/api/posts/${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Something wrong with updating the post");
        } else{
            cleanFormData();
            handleModal();
        };
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">{id ? "Update Post" : "Create Post"} </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field"></div>
                        <label className="label">Post Name</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter post name"  
                                value={postName} 
                                onChange={(e) => setPostName(e.target.value)} 
                                className="input"
                                required />
                        </div>
                        <div className="field"></div>
                        <label className="label">Text</label>
                        <div className="control">
                            <input type="text" 
                                placeholder="enter post body"  
                                value={postBody} 
                                onChange={(e) => setPostBody(e.target.value)} 
                                className="input"
                                required />
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (<button className="button is-info" onClick={handleUpdatePost}>Update</button>): 
                    (<button className="button is-primary" onClick={handleCreatePost}>Create</button>)}
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default Posts;