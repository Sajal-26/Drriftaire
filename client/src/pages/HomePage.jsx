import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FAQSection from "../components/FAQSection";

const highlights = [
  {
    title: "Precision spraying",
    description: "Target crops evenly with faster turnaround and less manual strain.",
  },
  {
    title: "Field-ready planning",
    description: "Book by acreage, crop type, and preferred date in a few quick steps.",
  },
  {
    title: "Rural-first support",
    description: "Built for real farm workflows, not generic logistics dashboards.",
  },
];

/* ─── Animation Variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const revealRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
  },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
  },
};

const float = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function HomePage() {
  return (
    <main className="w-full text-[#243328]">
      {/* Hero with video background */}
      <div className="relative min-h-[680px] lg:min-h-[calc(100vh-96px)] overflow-hidden bg-[#f6f4ee]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/video-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover z-0"
        >
          <source src="/0404.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Deep Overlay for Contrast */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#18241c]/80 via-[#18241c]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#18241c]/10 to-[#f6f4ee] pointer-events-none" />
        
        <section className="relative z-10 mx-auto grid min-h-[680px] lg:min-h-[calc(100vh-96px)] max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col justify-center"
          >
            <motion.p 
              variants={fadeInUp}
              className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-emerald-400 drop-shadow-sm"
            >
              Smart Drone Agriculture
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl leading-[1.05] drop-shadow-xl"
            >
              Faster, safer crop spraying<br className="hidden sm:block" /> built for modern farms.
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="mt-8 max-w-xl text-base sm:text-xl leading-relaxed text-emerald-50/90 font-medium drop-shadow-md"
            >
              Drriftaire helps farms book drone operations with less friction, better
              planning, and a cleaner digital workflow from inquiry to completion.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex flex-col gap-4 items-center sm:flex-row sm:justify-start"
            >
              <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/booking"
                  className="group relative flex w-full sm:w-64 items-center justify-center overflow-hidden rounded-full bg-[#18241c] px-8 py-5 text-[12px] font-black uppercase tracking-[0.22em] text-white no-underline shadow-2xl shadow-black/20 transition-all hover:bg-[#28593b]"
                >
                  Book a Service
                </Link>
              </motion.div>
              <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/services"
                  className="flex w-full sm:w-64 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md px-8 py-5 text-[12px] font-black uppercase tracking-[0.22em] text-white no-underline transition hover:bg-white/20 hover:border-white/50"
                >
                  Explore Services
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:block rounded-[3rem] border border-white/40 bg-white/40 backdrop-blur-3xl p-8 shadow-[0_40px_100px_-32px_rgba(40,89,59,0.3)] self-center"
          >
            <div className="rounded-[2.5rem] bg-gradient-to-br from-[#eef3ec] to-[#f6f1ff] p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4b1f8a] opacity-50 mb-8">
                Experience the Difference
              </p>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid gap-6"
              >
                {highlights.map((item) => (
                  <motion.article
                    key={item.title}
                    variants={revealRight}
                    whileHover={{ x: 10, backgroundColor: "#ffffff" }}
                    className="rounded-[1.75rem] border border-white/60 bg-white/40 p-6 shadow-sm transition-all duration-300"
                  >
                    <h2 className="text-lg font-bold text-[#1d2b21]">{item.title}</h2>
                    <p className="mt-2 text-xs leading-6 text-[#56675b] font-medium">
                      {item.description}
                    </p>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* What is Drriftaire Section */}
      <section className="relative z-10 bg-[#f6f4ee] pt-2 pb-24 lg:pt-28 px-6 lg:px-10 -mt-0.5 outline-none border-none">
        <div className="mx-auto max-w-7xl grid gap-12 items-center lg:grid-cols-[380px_1fr]">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-[auto_auto] gap-3 sm:gap-6 justify-center lg:justify-start items-center w-full"
          >
            <div className="flex flex-col gap-3 sm:gap-6">
              <motion.div variants={revealLeft} className="w-[110px] sm:w-[150px] aspect-[15/16] rounded-[1.8rem] sm:rounded-[3rem] overflow-hidden shadow-xl">
                <img src="/wheat-field.png" alt="" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div variants={revealLeft} className="relative w-[110px] sm:w-[150px] aspect-[15/18] rounded-[1.8rem] sm:rounded-[3rem] overflow-hidden shadow-xl">
                <img src="/drone-spraying.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#28593b]/30" />
              </motion.div>
            </div>
            <motion.div variants={revealRight} className="relative w-[165px] sm:w-[210px] aspect-[21/36] rounded-[2.2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl mt-4 sm:mt-8">
              <img src="/farm-landscape.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a24]/80 via-transparent to-transparent flex items-end justify-center pb-6 sm:pb-8">
                <p className="text-white text-[9px] sm:text-xs font-bold uppercase tracking-[0.25em] text-center leading-relaxed">
                  Farming<br /><span className="text-xs sm:text-lg">Made Smart</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer}
            className="lg:pl-10 text-center lg:text-left"
          >
            <motion.p variants={fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#28593b]">Our Mission</motion.p>
            <motion.h2 variants={fadeInUp} className="mt-4 text-3xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl leading-[1.1]">
              A platform built for<br />Indian agriculture.
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-[#55665a] mx-auto lg:mx-0">
              Drriftaire is more than just technology. It's a comprehensive ecosystem that 
              brings high-precision drone services to every district. We empower rural 
              entrepreneurs as drone operators, ensuring that the next generation of 
              farming is efficient, sustainable, and accessible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Technology in Action: Hexadrone Section */}
      <section className="relative overflow-hidden bg-[#18241c] py-20 lg:py-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-20 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={float}
              animate="animate"
              className="relative"
            >
              <motion.div
                variants={fadeInUp}
                className="relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
              >
                <img
                  src="/hexadrone-action.png"
                  alt="Hexadrone in Action"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a24]/60 to-transparent" />
              </motion.div>
              {/* Decorative accent */}
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#28593b]/20 blur-[80px] pointer-events-none" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e2ebd8]">
                Precision Tech
              </motion.p>
              <motion.h2 variants={fadeInUp} className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
                Hardened for the field.
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-8 text-lg leading-relaxed text-[#a8b8ac]">
                Our hexadrones are custom-engineered for longevity and precision. 
                Featuring advanced flight controllers and localized calibration, we 
                ensure that every operation is safe, repeatable, and optimized for 
                your specific crop varieties.
              </motion.p>
              
              <motion.div variants={staggerContainer} className="mt-8 sm:mt-12 grid grid-cols-2 gap-6 sm:gap-10 border-t border-white/10 pt-8 sm:pt-10">
                <motion.div variants={fadeInUp}>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">10 Litre</p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7a8d7f] mt-2">Payload Capacity</p>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">30%</p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7a8d7f] mt-2">Less Cost</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Empowering Farmers Section */}
      <section className="bg-white py-20 lg:py-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-[0.28em] text-[#28593b]">Impact</motion.p>
            <motion.h2 variants={fadeInUp} className="mt-4 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-6xl">
              Results you can trust.
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                img: "/happy-farmer.png",
                title: "Boosting Productivity",
                desc: "Precision drone spraying ensures uniform coverage with zero chemical waste. We drastically reduce costs while significantly improving yields.",
                label: "ROI Focus",
                color: "text-[#28593b]",
                pos: "object-top"
              },
              {
                img: "/booking-real.png",
                title: "Seamless Booking",
                desc: "Our streamlined digital dashboard removes field complexity. Schedule sorties and receive spray logs in under two minutes.",
                label: "Digital First",
                color: "text-[#4b1f8a]",
                pos: "object-center"
              }
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[2.5rem] bg-[#f6f4ee] p-8 transition-all hover:bg-[#eef3ec] hover:shadow-xl hover:shadow-gray-100"
              >
                <div className="mb-8 h-72 w-full overflow-hidden rounded-[2rem] shadow-sm">
                  <img src={card.img} alt="" className={`h-full w-full object-cover ${card.pos} transition-transform duration-1000 group-hover:scale-110`} />
                </div>
                <h3 className="text-2xl font-bold text-[#18241c]">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#55665a]">{card.desc}</p>
                
                <div className="mt-8 flex items-center justify-between">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${card.color}`}>— {card.label}</p>
                  <Link 
                    to="/booking"
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#18241c] shadow-sm transition hover:bg-[#18241c] hover:text-white"
                  >
                    <span className="text-lg">🗓️</span> Book Now
                  </Link>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="rounded-[2.5rem] bg-[#28593b] p-10 text-white shadow-2xl shadow-[#28593b]/20 flex flex-col justify-between"
            >
              <div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-8 text-5xl"
                >
                  🌱
                </motion.div>
                <h3 className="text-2xl font-bold">Sustainable Future</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/80 font-medium">
                  We're reducing chemical runoff by up to 30% through targeted
                  spraying, preserving Indian farmland for the next generation.
                </p>
              </div>
              <Link
                to="/about"
                className="mt-10 inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#e2ebd8] hover:translate-x-2 transition-transform duration-300"
              >
                Learn More →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FAQSection />

      {/* Future of Farming: Final CTA Expansion */}
      <section className="relative overflow-hidden bg-[#f6f4ee] py-32 px-6 lg:px-10">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-[500px] w-[500px] rounded-full bg-[#28593b]/5 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-5xl font-extrabold tracking-tight text-[#18241c] sm:text-7xl leading-[1.05]">
              The future of farming<br />is <span className="text-[#28593b]">airborne.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-10 text-xl leading-relaxed text-[#55665a] max-w-2xl mx-auto">
              Join thousands of Indian farmers who are leveraging drone
              technology to build more profitable and sustainable operations.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/booking"
                  className="inline-block w-full sm:w-auto rounded-full bg-[#18241c] px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#28593b] shadow-xl shadow-black/10"
                >
                  Start Today
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-block w-full sm:w-auto rounded-full border border-[#18241c]/10 bg-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#18241c] transition hover:bg-gray-50"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
