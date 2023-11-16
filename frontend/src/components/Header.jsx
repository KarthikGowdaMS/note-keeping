import HighlightIcon from '@mui/icons-material/Highlight';
import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/logincontext';
export default function Header(props) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  function handleLogout() {
    axios
      .get('https://karthik-notes-keeping.azurewebsites.net/auth/logout', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        // Update isLoggedIn state to false
        setIsLoggedIn(false);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // console.log(isLoggedIn);
  return (
    <header>
      <Link to="/">
        <h1 className="nav-heading">
          <HighlightIcon /> Keeper
        </h1>
      </Link>
      {isLoggedIn ? (
        <>
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
