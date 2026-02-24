import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageFade from './components/motion/PageFade';
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
        <Route path="/"           element={<PageFade><LandingPage /></PageFade>} />
        <Route path="/home"       element={<PageFade><Home /></PageFade>} />
        <Route path="/categories" element={<PageFade><Categories /></PageFade>} />
        <Route path="/popular"    element={<PageFade><Popular /></PageFade>} />
        <Route path="/latest"     element={<PageFade><Latest /></PageFade>} />
        <Route path="/login"      element={<PageFade><Login /></PageFade>} />
        <Route path="/signup"     element={<PageFade><Signup /></PageFade>} />
        <Route path="/dashboard"  element={<PageFade><UserDashboard /></PageFade>} />
        <Route path="/admin"      element={<PageFade><AdminDashboard /></PageFade>} />
        <Route path="*"           element={
          <PageFade>
            <main style={{ textAlign: 'center', padding: '6rem 1rem' }}>
              <h2 style={{ fontSize: '3rem' }}>404</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Page not found.</p>
            </main>
          </PageFade>
        } />
      </Routes>
      <Footer />
    </>
  );
}
