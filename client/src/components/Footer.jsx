import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Footer.module.css";

const footerGroups = [
  {
    title: "Navigate",
    links: [
      { to: "/", label: "Home" },
      { to: "/services", label: "Services" },
      { to: "/booking", label: "Booking" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/why-us", label: "Why Us" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

function Footer() {
  const location = useLocation();

  if (location.pathname === "/admin") {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link to="/" className={styles.brand}>
            Drriftaire
          </Link>
          <p className={styles.tagline}>
            Precision-first drone agriculture with a cleaner path from booking to field
            operations.
          </p>
          <div className={styles.meta}>
            <span>drriftaire@gmail.com</span>
            <span>+91 90000 00000</span>
          </div>
        </div>

        <div className={styles.linkColumns}>
          {footerGroups.map((group) => (
            <section key={group.title} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          Copyright {new Date().getFullYear()} Drriftaire. Built for modern agricultural operations.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
