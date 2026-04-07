import { motion } from "framer-motion";

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
      {/* Redesigned Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-20 lg:grid-cols-[1fr_1.1fr] items-center"
          >
            {/* Left Column: Text Content */}
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
              <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#28593b]/10 bg-white px-6 py-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#28593b]/60">Reliability</p>
                  <p className="mt-1 text-sm font-bold text-[#18241c]">ISO Certified Ops</p>
                </div>
                <div className="rounded-2xl border border-[#28593b]/10 bg-white px-6 py-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#28593b]/60">Accuracy</p>
                  <p className="mt-1 text-sm font-bold text-[#18241c]">AI Pathing Tools</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visual Collage */}
            <div className="relative">
              {/* Main Illustration */}
              <motion.div
                variants={fadeInUp}
                className="relative z-10 aspect-square overflow-hidden rounded-[3rem] shadow-2xl border border-white/20"
              >
                <img src="/tea-plantation-india.png" alt="Indian Tea Plantation" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3a24]/20 to-transparent" />
              </motion.div>

              {/* Cinematic Detail Image (Floating) - Desktop Only */}
              <motion.div
                variants={float}
                animate="animate"
                className="absolute -right-8 -top-8 z-20 h-48 w-48 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white hidden lg:block"
              >
                <img src="/drone-tech-detail.png" alt="Drone Sensor" className="h-full w-full object-cover" />
              </motion.div>

              {/* Insight Card 1 (Floating) - Desktop Only */}
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

              {/* Insight Card 2 (Bottom Right) - Desktop Only */}
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

      {/* Stats Section */}
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

      {/* Advantages Grid */}
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
