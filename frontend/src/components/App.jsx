import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  axios
    .get(`https://karthik-notes-keeping.azurewebsites.net/api/notes`)
    .then((response) => {
      setNotes(response.data);
    });


  async function addNote(obj) {
    if (editingNote) {
      await axios.post(`https://karthik-notes-keeping.azurewebsites.net/api/edit/${editingNote._id}`, {
        title: obj.title,
        content: obj.content
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setEditingNote(null);
    }
    else {
      await axios.post('https://karthik-notes-keeping.azurewebsites.net/api/add', {
        title: obj.title,
        content: obj.content
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
  }

  function deleteNote(id) {
    console.log(id);
    axios.post(`https://karthik-notes-keeping.azurewebsites.net/api/delete/${id}`)
      .then(function (response) {
        // setNotes(response.data);
      })
      .catch(function (error) {
        console.log(error);
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
      <Header />
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
      <Footer />
    </div>
  );
}

export default App;
