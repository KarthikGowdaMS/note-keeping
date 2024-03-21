import HighlightIcon from '@mui/icons-material/Highlight';
import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/logincontext';
import BASE_URL from '../config';
export default function Header(props) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  function handleLogout() {
    axios
      .get(BASE_URL+'/auth/logout', {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response);
        // Update isLoggedIn state to false
        setIsLoggedIn(false);
        props.showAlert('Logged out successfully', 'success');
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
              className="btn btn-primary nav-btn"
              to="/"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        </>
      ) : (
        <div className="btn-container">
          <Link className="btn btn-primary nav-btn" to="/login">
            Sign In
          </Link>
          <Link className="btn btn-primary nav-btn" to="/signup">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
