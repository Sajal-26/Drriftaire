import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Navbar.module.css';

const navSections = [
  {
    id: 'primary',
    items: [
      { to: '/', label: 'Home' },
      { to: '/services', label: 'Services' },
      { to: '/partner', label: 'Partners' },
      { to: '/booking', label: 'Booking' },
    ],
  },
  {
    id: 'secondary',
    items: [
      { to: '/why-us', label: 'Why us' },
      { to: '/about', label: 'About' },
      { to: '/careers', label: 'Careers' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const scrollContainer = document.querySelector('.app-content');
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = scrollContainer.scrollTop;
          
          if (currentScrollY < 10) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const renderNavItems = (items) =>
    items.map((item) => (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.to === '/'}
          onClick={() => setIsMenuOpen(false)}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`.trim()
          }
        >
          {item.label}
        </NavLink>
      </li>
    ));

  return (
    <motion.header 
      className={styles.shell}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className={styles.navbar} aria-label="Primary navigation">
        <ul className={`${styles.linkGroup} ${styles.leftLinks}`}>
          {renderNavItems(navSections[0].items)}
        </ul>

        <Link to="/" className={styles.logoContainer} aria-label="Drriftaire home">
          <span className={styles.logoText}>Drriftaire</span>
        </Link>

        <div className={styles.actions}>
          <ul className={`${styles.linkGroup} ${styles.rightLinks}`}>
            {renderNavItems(navSections[1].items)}
          </ul>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={styles.menuButtonLine} />
            <span className={styles.menuButtonLine} />
            <span className={styles.menuButtonLine} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`${styles.mobilePanel} ${isMenuOpen ? styles.mobilePanelOpen : ''}`}
      >
        <div className={styles.mobilePanelInner}>
          {navSections.map((section) => (
            <ul key={section.id} className={styles.mobileList}>
              {renderNavItems(section.items)}
            </ul>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
