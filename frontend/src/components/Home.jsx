import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/logincontext';

import Note from './Note';
import CreateArea from './CreateArea';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home(props) {
  const { isLoggedIn } = useContext(AuthContext);
  const [notesUpdated, setNotesUpdated] = useState(false);
  // const [greeting, setGreeting] = useState('');
  const [alert, setAlert] = useState('Loading Notes...');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [userName, setUserName] = useState('');

  // useEffect(() => {
  //   const hours = new Date().getHours();
  //   if (hours >= 0 && hours < 12) {
  //     setGreeting('Good Morning');
  //   } else if (hours >= 12 && hours < 16) {
  //     setGreeting('Good Afternoon');
  //   } else {
  //     setGreeting('Good Evening');
  //   }
  // }, []);

  // console.log(isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      getUser();
      getNotes();
    }
  }, [isLoggedIn, notesUpdated]);

  async function getNotes() {
    await axios
      .get(`https://karthik-notes-keeping.azurewebsites.net/api/notes`, { withCredentials: true })
      .then((response) => {
        // console.log(response.data);
        setNotes(response.data);
        if (response.data.length === 0) {
          setAlert('No Notes to display');
        } else {
          setAlert('');
        }
      });
  }

  async function getUser() {
    const response = await axios.get('https://karthik-notes-keeping.azurewebsites.net/api/auth/getuser', {
      withCredentials: true,
    });
    console.log(response.data);
    setUserName(response.data);
  }

  async function addNote(obj) {
    // console.log(obj);
    if (editingNote) {
      await axios.post(
        `https://karthik-notes-keeping.azurewebsites.net/api/notes/edit/${editingNote._id}`,
        {
          title: obj.title,
          content: obj.content,
        },
        { withCredentials: true }
      );
      setEditingNote(null);
      // getNotes();
      setNotesUpdated(!notesUpdated);
    } else {
      await axios.post(
        'https://karthik-notes-keeping.azurewebsites.net/api/notes/add',
        {
          title: obj.title,
          content: obj.content,
        },
        { withCredentials: true }
      );
      // getNotes();
      setNotesUpdated(!notesUpdated);
    }
  }

  async function deleteNote(id) {
    console.log(id);
    await axios.post(`https://karthik-notes-keeping.azurewebsites.net/api/notes/delete/${id}`, null, {
      withCredentials: true,
    });
    // getNotes();
    setNotesUpdated(!notesUpdated);
  }

  function editNote(id) {
    // console.log(id);
    const note = notes.find((note) => note._id === id);
    // console.log(note)
    setEditingNote(note);
  }
  return (
    <>
      {!isLoggedIn ? (
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
          <h1 className='greeting'>hello {userName}</h1>
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
