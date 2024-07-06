import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState("");

  const signIn = (username, password) => {
    // Perform your authentication logic here.
    // This is just a mock example.
   // if (username === 'user' && password === 'pass') {
      setIsSignedIn(true);
      setUser(username);
    //}
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
