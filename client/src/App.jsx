import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Play from './pages/Play.jsx';
import Report from './pages/Report.jsx';
import Mentor from './pages/Mentor.jsx';
import Saved from './pages/Saved.jsx';
import { getCode } from './lib/session.js';

function Header() {
  const location = useLocation();
  const [code, setCodeState] = useState(getCode());

  useEffect(() => {
    setCodeState(getCode());
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="Future You 2036 home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-text">
            Future You <em>2036</em>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Simulator
          </NavLink>
          <NavLink to="/mentor">AI Career Mentor</NavLink>
          <NavLink to="/saved">Saved futures</NavLink>
        </nav>
        <div className="nav-actions">
          {code ? (
            <Link to="/play" className="btn btn-ghost btn-sm">
              Continue
            </Link>
          ) : (
            <Link to="/play" className="btn btn-primary btn-sm">
              Start Your Future
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          <strong>Future You 2036</strong> — a simulation, not a prophecy. Your progress is saved on our server so you can
          come back to it.
        </p>
        <p className="footer-fine">
          No account required to play. Your save code is the only key to your run — keep it if you switch devices.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/:code" element={<Report />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
