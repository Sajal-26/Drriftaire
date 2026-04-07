import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import styles from '../styles/BookNowFAB.module.css';

export default function BookNowFAB() {
  const navigate = useNavigate();
  const location = useLocation();

  const isExcludedPage = ['/booking', '/admin'].includes(location.pathname);
  if (isExcludedPage) return null;

  const handleClick = () => {
    navigate('/booking#form');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={styles.fab}
      aria-label="Book Now"
    >
      <div className={styles.pulseContainer}>
        <div className={styles.pulse} />
        <Calendar className={styles.icon} />
      </div>
      <span className={styles.text}>Book Now</span>
    </motion.button>
  );
}
