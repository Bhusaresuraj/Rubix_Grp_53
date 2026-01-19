"use client"
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  const login = (name) => {
    const mockUser = { name, role: 'Mine Manager', id: 'M-123' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout };
}