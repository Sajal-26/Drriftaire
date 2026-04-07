import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
  }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};
const values = [
  {
    title: "Real-World Impact",
    desc: "We don't just build dashboards. We're in the fields, directly increasing yields and reducing chemical use for thousands of Indian farmers.",
    icon: "🌍"
  },
  {
    title: "Cutting-Edge Tech",
    desc: "From autonomous flight paths to AI-driven spectral analysis, you'll work with the most advanced hardware and software in the agri-space.",
    icon: "🚀"
  },
  {
    title: "Radical Ownership",
    desc: "We hire for intelligence and bias for action. Every team member has the autonomy to identify problems and build world-class solutions.",
    icon: "⚡"
  }
];
const hiringSteps = [
  {
    number: "01",
    title: "Initial Spark",
    desc: "Send us your CV and a brief note on why Drriftaire's mission resonates with you."
  },
  {
    number: "02",
    title: "Deep Dive",
    desc: "A technical or operational conversation to explore your skills and expertise."
  },
  {
    number: "03",
    title: "Values Check",
    desc: "Meet the core team to ensure our cultures and long-term visions are aligned."
  },
  {
    number: "04",
    title: "Onboarding & Flight",
    desc: "Join the revolution. We provide full training and set you up for takeoff."
  }
];
function CareersPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  return (
    <main className="w-full bg-[#f6f4ee] text-[#243328] overflow-hidden">
      {}
      <section ref={heroRef} className="relative h-[85vh] flex items-center justify-center bg-[#18241c] overflow-hidden">
        <motion.div 
          style={{ y: heroBgY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2000" 
            alt="Team working" 
            className="w-full h-full object-cover scale-110 grayscale brightness-50"
          />
        </motion.div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            className="text-[10px] sm:text-xs font-bold uppercase text-emerald-400"
          >
            Join the Revolution
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 1.2 }}
            className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-8xl leading-[0.95]"
          >
            Let's <span className="text-emerald-400">cultivate</span><br />the next era.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-12 mx-auto max-w-2xl text-lg sm:text-xl text-[#a8b8ac] leading-relaxed"
          >
            We're building the infrastructure for autonomous agriculture. 
            No open roles? No problem. We hire for mission over job titles.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="mt-16"
          >
            <a href="#talent" className="group relative inline-flex items-center gap-4 rounded-full bg-[#18241c] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#28593b] hover:pr-14 shadow-2xl shadow-black/20">
              Apply to Talent Network
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all font-black">→</span>
            </a>
          </motion.div>
        </div>
        {}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        </motion.div>
      </section>
      {}
      <section className="py-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.1)" }}
                className="group relative p-10 py-16 rounded-[3rem] bg-white border border-[#d1dbc1] transition-all duration-500"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{v.icon}</div>
                <h3 className="text-2xl font-bold text-[#18241c] leading-tight">{v.title}</h3>
                <p className="mt-6 text-[#55665a] leading-relaxed font-medium">{v.desc}</p>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-1 w-0 bg-[#28593b] group-hover:w-16 transition-all duration-500 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="bg-[#18241c] py-32 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f1a13] opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Our Path</motion.p>
            <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">The Hiring Journey</motion.h2>
          </div>
          <motion.div 
            className="grid md:grid-cols-4 gap-4 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {}
            <div className="hidden md:block absolute top-[115px] left-[15%] right-[15%] h-[1px] bg-white/10" />
            {hiringSteps.map((s, i) => (
              <motion.div 
                key={s.number}
                variants={fadeInUp}
                className="relative z-20 flex flex-col items-center text-center px-4"
              >
                <div className="h-24 w-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-white text-3xl font-black mb-8 group overflow-hidden">
                   <motion.span whileInView={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, delay: i * 0.2 }}>{s.number}</motion.span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-sm text-[#a8b8ac] leading-relaxed max-w-[200px]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {}
      <section id="talent" className="py-40 px-6 lg:px-10 text-center relative overflow-hidden bg-[#f1f5e9]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 inline-block rounded-2xl bg-[#28593b]/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#28593b]">
             Mission over Listings
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-7xl leading-[1.05] mb-12">
             No role open for you? <br />
             <span className="text-emerald-600">Apply anyway.</span>
          </h2>
          <p className="mt-8 text-xl leading-relaxed text-[#55665a] max-w-2xl mx-auto mb-16">
            We are always looking for missionaries, not mercenaries. 
            If you want to build the future of Indian agriculture, send your story to our talent pool.
          </p>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:careers@drriftaire.com" 
            className="inline-block rounded-full bg-[#18241c] text-white font-bold py-6 px-14 text-sm uppercase tracking-widest hover:bg-[#28593b] shadow-2xl transition-all"
          >
            Submit your story
          </motion.a>
        </motion.div>
        {}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
      </section>
    </main>
  );
}
export default CareersPage;
