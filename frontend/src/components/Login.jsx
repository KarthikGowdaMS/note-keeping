import React from 'react';
import { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/logincontext';
import { UserNameContext } from '../context/namecontext';
import BASE_URL from '../config';
import axios from 'axios';

export default function Login(props) {
  // console.log(props);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const { updateUserName } = useContext(UserNameContext);

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

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email: credentials.email,
          password: credentials.password,
        },
        { withCredentials: true }
      );

      // console.log(response.status);

      if (response.status === 200 && response.status < 300) {
        const json = response.data;
        // console.log(json);
        if (json.success) {
          props.showAlert('Logged in Success', 'success');
          setIsLoggedIn(true);
          updateUserName(json.user.name);
          navigate('/');
        }
      }
    } catch (error) {
      // console.error(error);
      if (error.response && error.response.status === 401) {
        props.showAlert('Invalid Credentials', 'danger');
        navigate('/login');
      } else if (error.response && error.response.status === 400) {
        const json = error.response.data;
        // console.log(json);
        props.showAlert(json.error, 'danger');
        navigate('/login');
      }
    }
  }
  // async function handleOauthLogin(e) {
  //   e.preventDefault();
  //   window.open(`${BASE_URL}/auth/google`, '_self');
  //   try {
  //     const response = await axios.get(`${BASE_URL}/login/success`);
  //     console.log(response.status);
  //     if (response.status === 200 && response.status < 300) {
  //       const json = response.data;

  //       if (json.success) {
  //         props.showAlert('Logged in Success', 'success');
  //         setIsLoggedIn(true);
  //         navigate('/');
  //       }
  //     }
  //     const data = response.data;
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }
  async function handleGOauthLogin(e) {
    e.preventDefault();
    updateUserName('');
    window.open(`${BASE_URL}/auth/google`, '_self');
    // Wait for Google OAuth process to complete

    // try {
    //       const response = await axios.get(`${BASE_URL}/auth/google/callback`);
    //       // console.log(response.status);
    //       if (response.status === 200 && response.status < 300) {
    //         const json = response.data;

    //         if (json.success) {
    //           props.showAlert('Logged in Success', 'success');
    //           setIsLoggedIn(true);
    //           navigate('/');
    //         }
    //       }
    //     } catch (error) {
    //       // console.error('Error:', error);
    //     }

  }

  async function handleFOauthLogin(e) {
    e.preventDefault();
    updateUserName('');
    window.open(`${BASE_URL}/auth/facebook`, '_self');
    // Wait for Google OAuth process to complete

    // try {
    //       const response = await axios.get(`${BASE_URL}/auth/google/callback`);
    //       // console.log(response.status);
    //       if (response.status === 200 && response.status < 300) {
    //         const json = response.data;

    //         if (json.success) {
    //           props.showAlert('Logged in Success', 'success');
    //           setIsLoggedIn(true);
    //           navigate('/');
    //         }
    //       }
    //     } catch (error) {
    //       // console.error('Error:', error);
    //     }

  }
  async function handleGiOauthLogin(e) {
    e.preventDefault();
    updateUserName('');
    window.open(`${BASE_URL}/auth/github`, '_self');
    // Wait for Google OAuth process to complete

    // try {
    //       const response = await axios.get(`${BASE_URL}/auth/google/callback`);
    //       // console.log(response.status);
    //       if (response.status === 200 && response.status < 300) {
    //         const json = response.data;

    //         if (json.success) {
    //           props.showAlert('Logged in Success', 'success');
    //           setIsLoggedIn(true);
    //           navigate('/');
    //         }
    //       }
    //     } catch (error) {
    //       // console.error('Error:', error);
    //     }

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
                  className="btn btn-light password-button"
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
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleGOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-google"></i>Sign In With Google
            </button>
            
          </div>
        </div>
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleFOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-facebook"></i>Sign In With Facebook
            </button>
          </div>
        </div>
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleGiOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-github"></i>Sign In With Github
            </button>
          </div>
        </div>
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
