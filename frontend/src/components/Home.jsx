import React, { useState } from "react";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from 'axios';

function Home() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  axios
    .get(`http://localhost:5000/api/notes/`,{
      headers: {
        'auth-token': localStorage.getItem('token')
      }
    })
    .then((response) => {
      setNotes(response.data);
    });


  async function addNote(obj) {
    // console.log(obj);
    if (editingNote) {
      await axios.post(`http://localhost:5000/api/notes/edit/${editingNote._id}`, {
        title: obj.title,
        content: obj.content
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'auth-token': localStorage.getItem('token')
        }
      });
      setEditingNote(null);
    }
    else {
      await axios.post('http://localhost:5000/api/notes/add', {
        title: obj.title,
        content: obj.content
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'auth-token': localStorage.getItem('token')
        }
      })
    }
  }

  function deleteNote(id) {
    console.log(id);
    axios.post(`http://localhost:5000/api/notes/delete/${id}`,null,{
      headers:{
        'auth-token': localStorage.getItem('token')
      }
    });
  }

  function editNote(id) {
    // console.log(id);
    const note = notes.find(note => note._id === id);
    // console.log(note)
    setEditingNote(note);
  }

  return (

    <div>
      <h1>Name {localStorage.getItem('name')}</h1>
      <CreateArea addNote={addNote} editingNote={editingNote} />
      {notes.map((note) =>
        <Note
          deleteNote={deleteNote}
          editNote={editNote}
          key={note._id}
          id={note._id}
          note={note}
        />
      )}
    </div>
  );
}

export default Home;
