import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesPage from "./pages/ServicesPage";
import WhyUsPage from "./pages/WhyUsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PartnerPage from "./pages/PartnerPage";
import CareersPage from "./pages/CareersPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";
import BackToTop from "./components/BackToTop";
import BookNowFAB from "./components/BookNowFAB";
import ScrollToTop from "./components/ScrollToTop";
import Seo from "./components/Seo";
function App() {
  const location = useLocation();
  return (
    <div className="app-shell">
      <Seo />
      <Navbar />
      <ScrollToTop />
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/booking" element={<PageWrapper><BookingPage /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
            <Route path="/partner" element={<PageWrapper><PartnerPage /></PageWrapper>} />
            <Route path="/why-us" element={<PageWrapper><WhyUsPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/careers" element={<PageWrapper><CareersPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </main>
      <BackToTop />
      <BookNowFAB />
    </div>
  );
}
export default App;
