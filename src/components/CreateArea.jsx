import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import { orange } from '@mui/material/colors';

const fabStyle = {
    backgroundColor: orange[300],
    color: "#fff", // You can set the text color as well
};

function CreateArea(props) {

    const [isExpanded, setExpanded] = useState(false);
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

    function expand() {
        setExpanded(true);
    }

    function handleClick(event) {
        props.addNote(note);
        setNote({
            title: "",
            content: ""
        });
        event.preventDefault();
    }

    return (
        <div>
            <form className="create-note">
                {isExpanded && <input name="title" placeholder="Title" onChange={handleChange} value={note.title} />}
                <textarea name="content" onClick={expand} placeholder="Take a note..." rows={isExpanded ? 3 : 1} onChange={handleChange} value={note.content} />
                <Zoom in={isExpanded}>
                    <Fab onClick={handleClick} style={fabStyle} className="fab" size="small" ><AddIcon /></Fab>
                </Zoom>
            </form>
        </div>
    );
}

export default CreateArea;
