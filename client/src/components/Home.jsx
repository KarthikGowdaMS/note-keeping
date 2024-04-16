import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/logincontext';
import { UserNameContext } from '../context/namecontext';
import Note from './Note';
import CreateArea from './CreateArea';
import BASE_URL from '../config';

function Home(props) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { updateUserName } = useContext(UserNameContext);
  const [notesUpdated, setNotesUpdated] = useState(false);
  const [alert, setAlert] = useState('Loading Notes...');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [greeting, setGreeting] = useState('');
  const renderWelcome = () => (
    <div className='container'>
      <h1 className="header">Note Take</h1>
      <div className="link-container">
        <Link className="auth-link link" to="/login">
          Login
        </Link>
        <Link className="auth-link link" to="/signup">
          SignUp
        </Link>
      </div>
    </div>
  );

  const renderLoggedIn = () => (
    <div>
      <h1 className="greeting">
        {greeting}, {localStorage.getItem('name')}
      </h1>
      <CreateArea addNote={addOrUpdateNote} editingNote={editingNote} />
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
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await axios.get(BASE_URL + '/auth/user', {
          withCredentials: true,
        });
        setIsLoggedIn(userResponse.data.isLoggedIn);
        updateUserName(userResponse.data.name);

        if (userResponse.data.isLoggedIn || triggerUpdate) {
          const notesResponse = await axios.get(`${BASE_URL}/api/notes/`, {
            withCredentials: true,
          });
          setNotes(notesResponse.data);
          setAlert(
            notesResponse.data.length === 0 ? 'No Notes to display' : ''
          );
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    }

    fetchData();
    setTriggerUpdate(false); // Reset trigger after fetching
  }, [isLoggedIn, setIsLoggedIn, updateUserName, triggerUpdate]);

  useEffect(() => {
    const hours = new Date().getHours();
    let greetingMsg = '';

    if (hours >= 0 && hours < 12) {
      greetingMsg = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
      greetingMsg = 'Good Afternoon';
    } else {
      greetingMsg = 'Good Evening';
    }

    setGreeting(greetingMsg);
  }, []);

  const addOrUpdateNote = async (obj) => {
    let endpoint = '/api/notes/add';
    let data = { title: obj.title, content: obj.content };

    if (editingNote) {
      endpoint = `/api/notes/edit/${editingNote._id}`;
      data = { ...data, _id: editingNote._id };
    }

    await axios.post(BASE_URL + endpoint, data, { withCredentials: true });
    setEditingNote(null);
    setNotesUpdated(!notesUpdated);
    setTriggerUpdate(true); // Trigger update after add/update action
  };

  const deleteNote = async (id) => {
    await axios.post(BASE_URL + `/api/notes/delete/${id}`, null, {
      withCredentials: true,
    });
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    setNotesUpdated(!notesUpdated);
    setTriggerUpdate(true); // Trigger update after add/update action
  };

  const editNote = (id) => {
    const note = notes.find((note) => note._id === id);
    setEditingNote(note);
  };

  return <>{!isLoggedIn ? renderWelcome() : renderLoggedIn()}</>;
}

export default Home;
