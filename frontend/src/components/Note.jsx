import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
function Note(props) {
  return (
    <div className="note">
      <h1>{props.note.title}</h1>
      <p>{props.note.content}</p>
      {/* <p>{props.note._id}</p> */}
      <button onClick={() => { props.deleteNote(props.note._id) }}><DeleteIcon /></button>
      <button onClick={() => { props.editNote(props.note._id) }}><EditIcon /></button>
    </div>
  );
}

export default Note;
