import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "../styles/ServicesPage.module.css";

const services = [
  {
    icon: "🌾",
    title: "Crop Spraying",
    description:
      "Uniform drone coverage for paddy, wheat, cotton & vegetables — minimal chemical waste.",
  },
  {
    icon: "📅",
    title: "Scheduled Ops",
    description:
      "Plan sorties by acreage, location & crop cycle. Every spray window optimised.",
  },
  {
    icon: "📍",
    title: "Field Coordination",
    description:
      "One streamlined flow for customer data, visit timing & job status tracking.",
  },
  {
    icon: "🔬",
    title: "Crop Health",
    description:
      "Aerial imaging catches stress, nutrient gaps & pest issues before visible damage.",
  },
  {
    icon: "🗺️",
    title: "Field Mapping",
    description:
      "HD orthomosaics & elevation maps — a precise digital twin of your farmland.",
  },
  {
    icon: "🤝",
    title: "Partner Network",
    description:
      "We train local operators so drone services reach every taluk, not just cities.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Book Online",
    description: "Field details, crop type, and preferred date — under two minutes.",
  },
  {
    number: "02",
    title: "Site Assessment",
    description: "Our team reviews terrain, obstacles & local conditions.",
  },
  {
    number: "03",
    title: "Drone Dispatch",
    description: "Certified operator arrives with calibrated equipment on schedule.",
  },
  {
    number: "04",
    title: "Completion Report",
    description: "Spray log with coverage maps, volume & photo proof delivered.",
  },
];

/* Framer Motion helpers */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function ServicesPage() {
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  // grab .app-content scroll container for parallax
  React.useEffect(() => {
    containerRef.current = document.querySelector(".app-content");
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    container: containerRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="w-full">
      {/* ─── Hero ─── */}
      <section className={styles.hero} ref={heroRef}>
        <motion.img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80&auto=format"
          alt=""
          className={styles.heroBg}
          loading="eager"
          style={{ scale: heroScale }}
        />
        <div className={styles.heroOverlay} />

        <motion.div
          className={styles.heroContent}
          style={{ opacity: heroOpacity }}
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.heroTag}
          >
            Our Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className={styles.heroTitle}
          >
            Precision agriculture,
            <br />
            delivered by drone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={styles.heroSubtitle}
          >
            From aerial spraying to crop health monitoring — we bring
            cutting-edge drone technology directly to your fields, with zero
            friction and complete transparency.
          </motion.p>
        </motion.div>
      </section>

      {/* ─── Services Grid ─── */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesInner}>
          {/* Header: text left + image right */}
          <div className={styles.servicesHeader}>
            <motion.div
              className={styles.servicesHeaderText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className={styles.sectionLabel}>
                What We Offer
              </motion.p>
              <motion.h2 variants={fadeUp} className={styles.sectionTitle}>
                End-to-end drone services
                <br />
                for modern farming.
              </motion.h2>
              <motion.div variants={fadeUp} className={styles.sectionDivider} />
              <motion.p variants={fadeUp} className={styles.sectionSubtext}>
                Every service is designed for Indian agricultural realities —
                fragmented holdings, diverse crops, and rural logistics.
              </motion.p>
            </motion.div>

            <motion.div
              className={styles.servicesHeaderImage}
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80&auto=format"
                alt="Golden wheat field at sunset"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Cards grid */}
          <motion.div
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.15 },
              },
            }}
          >
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 50px -16px rgba(40,89,59,0.2)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className={styles.serviceCard}
              >
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceCardTitle}>{s.title}</h3>
                <p className={styles.serviceCardDesc}>{s.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className={styles.processSection}>
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80&auto=format"
          alt=""
          className={styles.processBg}
          loading="lazy"
        />
        <div className={styles.processOverlay} />

        <motion.div
          className={styles.processInner}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <div className={styles.processHeader}>
            <motion.p variants={fadeUp} className={styles.processLabel}>
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} className={styles.processTitle}>
              Four steps from booking to field.
            </motion.h2>
          </div>

          <motion.div
            className={styles.processSteps}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.15 },
              },
            }}
          >
            {processSteps.map((step) => (
              <motion.div
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{
                  y: -4,
                  borderColor: "rgba(255,255,255,0.2)",
                  transition: { duration: 0.3 },
                }}
                className={styles.processStep}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Feature Highlight ─── */}
      <section className={styles.featureSection}>
        <div className={styles.featureInner}>
          <motion.div
            className={styles.featureImage}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeLeft}
          >
            <img
              src="https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&w=960"
              alt="Agricultural drone over green farmland"
              loading="lazy"
            />
            <div className={styles.featureImageOverlay} />
          </motion.div>

          <motion.div
            className={styles.featureText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeRight}
          >
            <p className={styles.featureLabel}>Why Drriftaire</p>
            <h2 className={styles.featureTitle}>
              Technology that understands
              <br />
              the Indian farmer.
            </h2>
            <div className={styles.sectionDivider} />
            <p className={styles.featureDesc}>
              Our drones are calibrated for local crop varieties and field
              sizes. We partner with rural entrepreneurs to build a network
              that scales with demand — bringing precision agriculture to
              every district, not just pilot zones.
            </p>
            <motion.div
              className={styles.featureStats}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12, delayChildren: 0.3 },
                },
              }}
            >
              {[
                { value: "50K+", label: "Acres Covered" },
                { value: "200+", label: "Field Operations" },
                { value: "95%", label: "Coverage Accuracy" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  className={styles.stat}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                >
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaInner}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <h2 className={styles.ctaTitle}>
            Ready to modernise your farm?
          </h2>
          <p className={styles.ctaSubtext}>
            Book a drone spraying session in minutes. No middlemen, no
            phone tag — just fast, transparent agricultural services.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Link to="/booking" className={styles.ctaButton}>
              Book a Service
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

export default ServicesPage;
