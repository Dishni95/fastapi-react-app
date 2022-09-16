import React from "react";
import { useState } from "react";

const CommentForm = ({handleSubmit, submitLabel} ) => {
    const [text, setText] = useState("");
    const [postId, setPostId] = useState(null)
    const isTextareaDisabled = text.length === 0;
    const onSubmit = event => {
        event.preventDefault();
        handleSubmit(text, postId);
        setText("");
    };
    return (
        <form onSubmit={onSubmit} action="">
            <textarea 
                className="comment-form-textarea"
                value={text} 
                onChange={(e)=>setText(e.target.value)}
            />
            <button className="comment-form-button" disabled={isTextareaDisabled}> {submitLabel}</button>
        </form>
    );
};

export default CommentForm;