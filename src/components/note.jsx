import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
function Note(props) {
  return (
    <div className="note">
      <h1>{props.note.title}</h1>
      <p>{props.note.content}</p>
      <button onClick={()=>{props.deleteNote(props.id)}}><DeleteIcon /></button>
    </div>
  );
}

export default Note;
