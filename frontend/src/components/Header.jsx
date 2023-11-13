import HighlightIcon from '@mui/icons-material/Highlight';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(props) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      setGreeting('Good Morning');
    } else if (hours >= 12 && hours < 16) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
  }
  return (
    <header>
      <Link to="/">
      <h1 className="nav-heading">
          <HighlightIcon /> Keeper
        </h1>
          </Link>
      {localStorage.getItem('token') ? (
        <>
          <p className='greeting'>
            {greeting}, {props.name.slice(0, props.name.indexOf(' '))}
          </p>
          <div className="btn-container logout">
            <Link
              className="btn btn-light nav-btn"
              to="/"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        </>
      ) : (
        <div className="btn-container">
          <Link className="btn btn-light nav-btn" to="/login">
            Login
          </Link>
          <Link className="btn btn-light nav-btn" to="/signup">
            SignUp
          </Link>
        </div>
      )}
    </header>
  );
}
