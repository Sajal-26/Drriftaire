import { motion } from "framer-motion";
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
const float = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
const stats = [
  { value: "90%", label: "Water Savings" },
  { value: "30%", label: "Chemical Reduction" },
  { value: "10x", label: "Faster Coverage" },
];
const advantages = [
  { 
    title: "Industrial Precision", 
    desc: "Our dual-mode autonomous flight systems ensure sub-10cm accuracy, eliminating chemical overlap and protecting non-crop areas with surgical precision.",
    icon: "🎯"
  },
  {
    title: "Localized Support",
    desc: "We don't just fly drones; we build regional hubs. Every service is backed by a local pilot who understands your specific soil, crop types, and seasonal challenges.",
    icon: "📍"
  },
  {
    title: "Zero-Hassle Logistics",
    desc: "Forget the coordination nightmare. From digital field mapping to automated spray logs, our platform handles the heavy lifting so you don't have to.",
    icon: "⚡"
  }
];
function WhyUsPage() {
  return (
    <main className="w-full bg-[#f6f4ee] text-[#243328]">
      {}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-20 lg:grid-cols-[1fr_1.1fr] items-center"
          >
            {}
            <div className="text-left">
              <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-[0.28em] text-[#28593b]">
                Why Choose Us
              </motion.p>
              <motion.h1 variants={fadeInUp} className="mt-6 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-6xl leading-[1.1]">
                Engineering the<br /><span className="text-[#28593b]">future of Indian farming.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-8 max-w-lg text-lg leading-relaxed text-[#55665a]">
                We combine cutting-edge aerospace engineering with deep-rooted 
                agricultural knowledge to solve the most pressing challenges 
                of modern field management.
              </motion.p>
              <motion.div 
                variants={fadeInUp} 
                className="mt-10 h-36 relative w-full max-w-md rounded-[2rem] bg-gradient-to-b from-white to-[#f4f7f4] border border-[#28593b]/10 overflow-hidden shadow-lg shadow-emerald-900/5 flex items-end justify-between pb-6 px-8"
              >
                {/* Sun/Horizon effect */}
                <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-orange-100/60 blur-md" />

                {/* Drone Animation */}
                <motion.div 
                  className="absolute top-6 left-0 z-20 flex flex-col items-center"
                  animate={{
                    x: [-100, 60, 260, 500],
                    y: [0, 15, 10, -30],
                    rotate: [12, 0, -2, -15]
                  }}
                  transition={{
                    duration: 6.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    times: [0, 0.25, 0.75, 1]
                  }}
                >
                  {/* Sophisticated Drone Body */}
                  <svg width="68" height="26" viewBox="0 0 68 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                    <motion.line x1="4" y1="4" x2="22" y2="4" stroke="#18241c" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.1, repeat: Infinity }} />
                    <motion.line x1="46" y1="4" x2="64" y2="4" stroke="#18241c" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.1, repeat: Infinity, delay: 0.05 }} />
                    <path d="M12 9 L56 9 C58.2 9 60 10.8 60 13 L52 19 L16 19 L8 13 C8 10.8 9.8 9 12 9 Z" fill="#28593b" />
                    <path d="M28 19 L40 19 L38 23 L30 23 Z" fill="#18241c" />
                    <circle cx="34" cy="13" r="2" fill="#4ade80" />
                  </svg>
                  
                  {/* Spray Particles */}
                  <motion.div 
                    className="flex gap-[5px] mt-1"
                    animate={{
                      opacity: [0, 0, 1, 1, 0, 0],
                      scaleY: [0, 0, 1, 1, 0, 0]
                    }}
                    transition={{
                      duration: 6.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      times: [0, 0.2, 0.25, 0.7, 0.75, 1]
                    }}
                    style={{ originY: 0 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="w-[2px] h-14 bg-emerald-400/80 rounded-full" 
                        animate={{ y: [0, 12, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.25 + (i * 0.05), repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                </motion.div>

                {/* Crops */}
                <div className="relative z-10 flex w-full justify-between items-end px-2">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={`crop-${i}`}
                      style={{ backgroundColor: "transparent" }}
                      className="relative origin-bottom flex items-end justify-center"
                      animate={{
                        color: ["#dce6db", "#dce6db", "#28593b", "#28593b", "#dce6db"],
                        scaleY: [0.6, 0.6, 1.2, 1.2, 0.6],
                        scaleX: [0.8, 0.8, 1.05, 1.05, 0.8]
                      }}
                      transition={{
                        duration: 6.5,
                        repeat: Infinity,
                        times: [0, 0.2 + (i * 0.06), 0.3 + (i * 0.06), 0.85, 1]
                      }}
                    >
                      <svg viewBox="0 0 24 36" className="w-5 h-8 sm:w-6 sm:h-10 text-current overflow-visible relative z-10">
                        {/* Main stem */}
                        <rect x="11" y="8" width="2" height="28" rx="1" fill="currentColor" />
                        
                        {/* Leaves / Grains left */}
                        <path d="M11,14 C6.5,10 3,14 7,18 C8.5,15 11,14.5 11,14Z" fill="currentColor" />
                        <path d="M11,20 C6.5,16 3,20 7,24 C8.5,21 11,20.5 11,20Z" fill="currentColor" />
                        <path d="M11,26 C6.5,22 3,26 7,30 C8.5,27 11,26.5 11,26Z" fill="currentColor" />

                        {/* Leaves / Grains right */}
                        <path d="M13,11 C17.5,7 21,11 17,15 C15.5,12 13,11.5 13,11Z" fill="currentColor" />
                        <path d="M13,17 C17.5,13 21,17 17,21 C15.5,18 13,17.5 13,17Z" fill="currentColor" />
                        <path d="M13,23 C17.5,19 21,23 17,27 C15.5,24 13,23.5 13,23Z" fill="currentColor" />

                        {/* Top grain */}
                        <path d="M12,2 C9,5 8,9 12,13 C16,9 15,5 12,2 Z" fill="currentColor" />
                      </svg>
                      
                      {/* Highly performant glow using opacity instead of drop-shadow filter */}
                      <motion.div 
                        className="absolute bottom-0 w-6 h-12 bg-emerald-500/30 blur-md rounded-full z-0"
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{
                          duration: 6.5,
                          repeat: Infinity,
                          times: [0, 0.2 + (i * 0.06), 0.3 + (i * 0.06), 0.85, 1]
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            {}
            <div className="relative">
              {}
              <motion.div
                variants={fadeInUp}
                className="relative z-10 aspect-square overflow-hidden rounded-[3rem] shadow-2xl border border-white/20"
              >
                <img src="/tea-plantation-india.png" alt="Indian Tea Plantation" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3a24]/20 to-transparent" />
              </motion.div>
              {}
              <motion.div
                variants={float}
                animate="animate"
                className="absolute -right-8 -top-8 z-20 h-48 w-48 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white hidden lg:block"
              >
                <img src="/drone-tech-detail.png" alt="Drone Sensor" className="h-full w-full object-cover" />
              </motion.div>
              {}
              <motion.div
                variants={float}
                animate="animate"
                className="absolute -left-12 bottom-12 z-20 rounded-[2rem] bg-[#18241c] p-6 text-white shadow-2xl shadow-emerald-900/40 hidden lg:block"
                style={{ transitionDelay: '0.2s' }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Application</p>
                    <p className="text-sm font-bold">99.9% Precision Rate</p>
                  </div>
                </div>
              </motion.div>
              {}
              <motion.div
                variants={fadeInUp}
                className="absolute right-12 -bottom-6 z-20 rounded-[1.5rem] bg-white p-5 shadow-xl border border-gray-100 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-[#18241c]">Live Telemetry Active</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {}
      <section className="bg-[#18241c] py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <p className="text-5xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[#7a8d7f]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {}
      <section className="py-32 px-6 lg:px-10 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid gap-10 md:grid-cols-3"
          >
            {advantages.map((adv) => (
              <motion.div
                key={adv.title}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group p-10 rounded-[2.5rem] bg-[#f6f4ee] hover:bg-[#eef3ec] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-gray-100"
              >
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 inline-block">{adv.icon}</div>
                <h3 className="text-2xl font-bold text-[#18241c]">{adv.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#55665a]">{adv.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
export default WhyUsPage;
