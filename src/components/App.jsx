import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {

  const [notes, setNotes] = useState([]);

  function addNote(obj) {
    setNotes((prevNotes) => {
      return [...prevNotes, obj];
    });
  }

  function deleteNote(id) {
    setNotes(prevItems => {
      return prevItems.filter((note, index) => {
        return index !== id;
      });
    });
  }
  return (

    <div>
      <Header />
      <CreateArea addNote={addNote} />
      {notes.map((note,index) =>
        <Note
          deleteNote={deleteNote}
          key={index}
          id={index}
          note={note}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
