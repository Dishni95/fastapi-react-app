import React from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Posts from "./Posts";

const Comments = ({postId}) => {

    const [token] = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [parentId, setParentId] = useState("");
    const [commentText, setCommentText] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const rootComments = comments.filter(backendComment => backendComment.parent_id === null);

    const getReplies = commentID => {
        return comments.filter(backendComment => backendComment.parent_id === commentID)
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
            setErrorMessage("Something went wrong. Couldn't load the comments");
            
        } else {
            const data = await response.json();
            setComments(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    const createComment  = async (text) => {
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                comment_text: text,
                post_id: postId,
            }),
            
        };
        const response = await fetch("/api/comments", requestOptions)
        if (!response.ok) {
            setErrorMessage("Something went wrong when creating comment");
        };
    };

    return (
        <div className="comments">
            <h3 className="comments-title">Comments</h3>
            <div className="comment-form-title">Write comment</div>
            <CommentForm submitLabel="Write" handleSubmit={createComment}/>

            <div className="comments-container">
                {rootComments.filter(backendComment => backendComment.post_id === postId).map((rootComment) => (
                    <Comment 
                    key={rootComment.id}
                    comment={rootComment} 
                    replies={getReplies(rootComment.id)}/>
                ))} 
                </div>
        </div>
    );
};

export default Comments;