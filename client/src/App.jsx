import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesPage from "./pages/ServicesPage";
import WhyUsPage from "./pages/WhyUsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";
import BackToTop from "./components/BackToTop";

function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/booking" element={<PageWrapper><BookingPage /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
            <Route path="/why-us" element={<PageWrapper><WhyUsPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </main>
      <BackToTop />
    </div>
  );
}

export default App;
