import React, { useEffect, useState } from 'react';
import Note from './Note';
import CreateArea from './CreateArea';
import axios from 'axios';
import { Link} from 'react-router-dom';
import Header from './Header';

function Home() {

  const success = localStorage.getItem('token');
  const [alert, setAlert] = useState('Loading Notes...');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (success) {
      axios
        .get(`https://karthik-notes-keeping.azurewebsites.net/api/notes`, {
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        })
        .then((response) => {
          setNotes(response.data);
          if (notes.length === 0) {
            setAlert('No Notes to display');
          } else {
            setAlert('');
          }
        });
    }
  });

  async function addNote(obj) {
    // console.log(obj);
    if (editingNote) {
      await axios.post(
        `https://karthik-notes-keeping.azurewebsites.net/api/notes/edit/${editingNote._id}`,
        {
          title: obj.title,
          content: obj.content,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );
      setEditingNote(null);
    } else {
      await axios.post(
        'https://karthik-notes-keeping.azurewebsites.net/api/notes/add',
        {
          title: obj.title,
          content: obj.content,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );
    }
  }

  function deleteNote(id) {
    console.log(id);
    axios.post(`https://karthik-notes-keeping.azurewebsites.net/api/notes/delete/${id}`, null, {
      headers: {
        'auth-token': localStorage.getItem('token'),
      },
    });
  }

  function editNote(id) {
    // console.log(id);
    const note = notes.find((note) => note._id === id);
    // console.log(note)
    setEditingNote(note);
  }
  return (
    <>
      <Header name={localStorage.getItem('name')} />
      {!success ? (
        <>
          <h1 className="header">Welcome to KG Notes</h1>
          <div className="link-container">
            <Link className="auth-link link" to="/login">
              Login
            </Link>
            <Link className="auth-link link" to="/signup">
              SignUp
            </Link>
          </div>
        </>
      ) : (
        <div>
          <CreateArea addNote={addNote} editingNote={editingNote} />
          {notes.length === 0 && (
            <div className="no-note">
              <h1>{alert}</h1>
            </div>
          )}
          {notes.map((note) => (
            <Note
              deleteNote={deleteNote}
              editNote={editNote}
              key={note._id}
              id={note._id}
              note={note}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
