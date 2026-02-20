import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import Popular from './pages/Popular/Popular';
import Latest from './pages/Latest/Latest';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Dedicated professional landing page */}
        <Route path="/"           element={<LandingPage />} />

        {/* Main browse + search page */}
        <Route path="/home"       element={<Home />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/popular"    element={<Popular />} />
        <Route path="/latest"     element={<Latest />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/dashboard"  element={<UserDashboard />} />
        <Route path="/admin"      element={<AdminDashboard />} />
        <Route path="*"           element={
          <main style={{ textAlign: 'center', padding: '6rem 1rem' }}>
            <h2 style={{ fontSize: '3rem' }}>404</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Page not found.</p>
          </main>
        } />
      </Routes>
      <Footer />
    </>
  );
}
