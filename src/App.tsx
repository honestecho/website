import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Consulting from './pages/Consulting';
import Platform from './pages/Platform';
import About from './pages/About';
import Contact from './pages/Contact';
import AppRedirect from './pages/AppRedirect';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Platform />} />
          <Route path="/platform" element={<Navigate to="/product" replace />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/app" element={<AppRedirect />} />
          <Route path="/pursuit" element={<AppRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
