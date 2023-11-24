import React, { createContext, useState } from 'react';

// 1. Create a new context
export const UserNameContext = createContext();

// 2. Create a provider component for this context
export function UserNameProvider({ children }) {
  // Get the initial userName from localStorage
  const initialUserName = localStorage.getItem('name') || '';

  // Create a state variable for the username
  const [userName, setUserName] = useState(initialUserName);

  // Create a new function to update userName and set it in localStorage
  const updateUserName = (newUserName) => {
    setUserName(newUserName);
    localStorage.setItem('name', newUserName);
  };

  return (
    <UserNameContext.Provider value={{ userName, updateUserName }}>
      {children}
    </UserNameContext.Provider>
  );
}