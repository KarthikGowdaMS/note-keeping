import React from 'react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();
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
    // console.log(credentials);
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem('token', json.authToken);
      localStorage.setItem('name', json.name);
      navigate('/home');
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
        New User? <a href="/signup">Sign up now</a>
      </p>
    </>
  );
}
