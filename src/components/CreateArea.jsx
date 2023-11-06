import React, { useState } from "react";

function CreateArea(props) {

    const [note, setNote] = useState({
        title: "",
        content: ""
    });

    function handleChange(event) {
        const { value, name } = event.target;
        setNote((prevNote) => {
            return { ...prevNote, [name]: value }
        });
    }

    function handleSubmit(event) {
        props.addNote(note);
        setNote({
            title:"",
            content:""
        });
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" onChange={handleChange} value={note.title} />
                <textarea name="content" placeholder="Take a note..." rows="3" onChange={handleChange} value={note.content} />
                <button>Add</button>
            </form>
        </div>
    );
}

export default CreateArea;
