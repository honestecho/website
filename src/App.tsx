import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Consulting from './pages/Consulting';
import Platform from './pages/Platform';
import About from './pages/About';
import Contact from './pages/Contact';
import AppRedirect from './pages/AppRedirect';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/platform" element={<Platform />} />
<Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/app" element={<AppRedirect />} />
          <Route path="/pursuit" element={<AppRedirect />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
