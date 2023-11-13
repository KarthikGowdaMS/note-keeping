import React from 'react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [samePassword, setSamePassword] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(credentials);
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: credentials.name,
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


  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleConfirmPasswordChange(e) {
    if (e.target.value === '' || credentials.password === '') {
      setSamePassword(true);
      return;
    }
    if (e.target.value === credentials.password) {
      setSamePassword(true);
    } else {
      setSamePassword(false);
    }
  }

  return (
    <>
      <h1 className="auth-header">Sign Up</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="text"
                className="form-control auth-input"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="email"
                className="form-control auth-input"
                name="email"
                placeholder="Email"
                onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Password"
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
              <input
                type="password"
                className="form-control auth-input"
                name="confirm_password"
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          {samePassword ? null : (
            <p className="error">Passwords do not match</p>
          )}

          <div className="row mb-6">
            <div className="col col-md-4">
              <button
                className="btn btn-primary login-button btn-submit"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
      <p className="existing">
        Already have an account? <a href="/login">Sign in now</a>
      </p>
    </>
  );
}
