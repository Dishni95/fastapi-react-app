import React from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Comment = ({comment, replies, postId}) => {

    const [token] = useContext(UserContext);

    return (
        
        <div className="comment">
            <div className="comment-image-container">
                <img src="/user-icon.png"/>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.owner_id}</div>
                </div>
                <div className="comment-text">{comment.comment_text}</div>
                <div className="comment-actions">
                    <div className="comment-action">Reply</div>
                    <div className="comment-action">Edit</div>
                    <div className="comment-action">Delete</div>
                </div>
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map(reply => (
                             <Comment comment={reply} key={reply.id} replies={[]}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
