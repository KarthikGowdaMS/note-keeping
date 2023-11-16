import React from 'react';
import { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/logincontext';

export default function Login(props) {
  console.log(props);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`https://karthik-notes-keeping.azurewebsites.net/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      credentials: 'include', // Include cookies
    });
    // console.log(response);
    if (response.status === 200 && response.status < 300) {
      const json = await response.json();
      if (json.success) {
        props.showAlert('Logged in Success', 'success');
        setIsLoggedIn(true);
        navigate('/');
      }
    } else if (response.status === 401) {
      props.showAlert('Invalid Credentials', 'danger');
      navigate('/login');
    }
    else if (response.status === 400) {
   const json = await response.json();
      console.log(json);
      props.showAlert(json.error, 'danger');
      navigate('/login');
    }
  }


  return (
    <>
      <h1 className="auth-header">Sign In</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="email"
                className="form-control auth-input"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={credentials.email}
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control auth-input"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={credentials.password}
                />
                <button
                  className="btn password-button"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <button
                className="btn btn-primary login-button btn-submit"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
      <p className="existing">
        New User?{' '}
        <Link className="link" to="/signup">
          Sign up now
        </Link>
      </p>
    </>
  );
}
