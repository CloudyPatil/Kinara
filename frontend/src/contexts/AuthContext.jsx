import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // The backend sends { sub: "user_id", role: "admin/owner/user" }
        setUser({ 
            id: decoded.sub, 
            role: decoded.role 
        });
      } catch (error) {
        console.error("Invalid token found, logging out...");
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ 
        id: decoded.sub, 
        role: decoded.role 
    });
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; // Redirect to home
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};