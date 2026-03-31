import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left Links */}
      <ul className={styles.leftLinks}>
        <li><Link to="/" className={styles.navItem}>Home</Link></li>
        <li><Link to="/services" className={styles.navItem}>Services</Link></li>
        <li><Link to="/booking" className={styles.navItem}>Booking</Link></li>
      </ul>

      {/* Center Logo */}
      <Link to="/" className={styles.logoContainer}>
        <span className={styles.logoText}>Drriftaire</span>
      </Link>

      {/* Right Links */}
      <ul className={styles.rightLinks}>
        <li><Link to="/why-us" className={styles.navItem}>Why us</Link></li>
        <li><Link to="/about" className={styles.navItem}>About</Link></li>
        <li><Link to="/contact" className={styles.navItem}>Contact us</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
