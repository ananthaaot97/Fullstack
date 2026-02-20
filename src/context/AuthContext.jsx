import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out

  const login = (email, password) => {
    // Mock login — accept any non-empty credentials
    if (email && password) {
      const isAdmin = email.includes('admin');
      setUser({
        id: 1,
        name: isAdmin ? 'Admin User' : 'Demo Student',
        email,
        role: isAdmin ? 'admin' : 'student',
        avatar: null,
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    if (name && email && password) {
      setUser({ id: Date.now(), name, email, role: 'student', avatar: null });
      return { success: true };
    }
    return { success: false, error: 'All fields are required' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
