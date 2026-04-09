import { motion } from "framer-motion";
import { useState } from "react";
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};
const stats = [
  { value: "6,000+", label: "Guaranteed Acres/Yr", icon: "🌾" },
  { value: "24/7", label: "Operational Support", icon: "🛠️" },
  { value: "0", label: "Upfront Friction", icon: "⚡" },
  { value: "100%", label: "Expert Guidance", icon: "🤝" }
];
const benefits = [
  {
    title: "Guaranteed Income",
    desc: "We connect you with our established network of farmers. Secure at least 1,000+ acres of spraying work annually from day one.",
    icon: "💰"
  },
  {
    title: "Technical & Logistics",
    desc: "Access 24/7 hardware support and managed equipment logistics, so you can focus entirely on your flight operations.",
    icon: "🚁"
  },
  {
    title: "Financial Assistance",
    desc: "We help you navigate AIF loans, drone insurance, and equipment financing to ensure your business starts on solid ground.",
    icon: "🏦"
  },
  {
    title: "Professional Training",
    desc: "No prior experience? No problem. We provide comprehensive drone pilot training and certification programs for our partners.",
    icon: "🎓"
  }
];
const steps = [
  { number: "01", title: "Join the Network", desc: "Submit your interest and pass our initial partner evaluation." },
  { number: "02", title: "Onboarding & Training", desc: "Complete our specialized drone flight and maintenance program." },
  { number: "03", title: "Connect with Farmers", desc: "Start receiving spraying requests through our managed dispatch network." },
  { number: "04", title: "Scale Your Business", desc: "Focus on growth while we handle the flight operations, logistics, and payments." }
];
function PartnerPage() {
  const [formStatus, setFormStatus] = useState("idle");
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => setFormStatus("success"), 1500);
  };
  return (
    <main className="w-full bg-[#f6f4ee] text-[#243328] overflow-hidden">
      { }
      <section className="relative pt-24 pb-32 px-6 lg:px-10 bg-[#18241c] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1713952160156-bb59cac789a9?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#18241c]/40 via-[#18241c] to-[#18241c] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-emerald-400"
          >
            Partner with Drriftaire
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.05]"
          >
            Powering the next generation<br />of <span className="text-emerald-400">Agri-Entrepreneurs.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-10 mx-auto max-w-2xl text-lg sm:text-xl text-[#a8b8ac] leading-relaxed"
          >
            Join our network and build a profitable drone service business with
            guaranteed earnings, full technical support, and premium technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          >
            <a href="#apply" className="rounded-full bg-[#18241c] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#28593b] shadow-xl shadow-black/10">
              Apply Now
            </a>
            <a href="/contact" className="rounded-full border border-white/20 bg-white/5 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10 backdrop-blur-md">
              Inquire More
            </a>
          </motion.div>
        </div>
      </section>
      { }
      <section className="relative z-20 -mt-12 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-[2.5rem] bg-white shadow-2xl shadow-[#18241c]/10 border border-[#18241c]/5 backdrop-blur-xl"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeInUp} className="text-center p-4 border-r border-[#28593b]/5 last:border-none">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-black text-[#18241c]">{s.value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#28593b]/60">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      { }
      <section className="py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#28593b]">A Growth Ecosystem</motion.p>
              <motion.h2 variants={fadeInUp} className="mt-5 text-3xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl leading-[1.1]">
                We handle the complexity,<br />you harvest the growth.
              </motion.h2>
              <motion.p variants={fadeInUp} className="mt-8 text-lg leading-relaxed text-[#55665a]">
                Running a drone business in rural India is challenging.
                From government regulations to finding consistent work,
                we've built the infrastructure so you can focus on scale.
              </motion.p>
              <motion.div variants={staggerContainer} className="mt-12 grid gap-8">
                {benefits.map((b) => (
                  <motion.div key={b.title} variants={fadeInUp} className="flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#28593b]/10 text-2xl">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#18241c]">{b.title}</h4>
                      <p className="mt-2 text-sm text-[#55665a] leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src="/partner-field.png"
                alt="Partner working in field"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#18241c]/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>
      { }
      <section className="bg-[#18241c] py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">The Journey</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Join in 4 steps.</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid gap-10 md:grid-cols-4"
          >
            {steps.map((s) => (
              <motion.div key={s.number} variants={fadeInUp} className="relative p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <span className="text-4xl font-black text-emerald-500/20">{s.number}</span>
                <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#a8b8ac]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      { }
      <section id="apply" className="py-24 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.2fr] gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#28593b]">Submit Application</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl leading-[1.1]">
              Ready to take flight?<br />Let's grow together.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-[#55665a]">
              Complete the form below and our partnership team will reach
              out within 48 hours for an initial screening.
            </p>
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-900/20">📞</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#28593b]/60">Call Directly</p>
                  <p className="text-xl font-bold text-[#18241c]">+91-7026983110</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-full bg-[#18241c] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-black/20">✉️</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#28593b]/60">Email Inquiries</p>
                  <p className="text-xl font-bold text-[#18241c]">support@drriftaire.com</p>
                </div>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-[3.5rem] bg-white shadow-2xl shadow-emerald-900/10 border border-emerald-900/5"
          >
            {formStatus === "success" ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-[#18241c]">Application Received!</h3>
                <p className="mt-4 text-[#55665a]">We'll be in touch with you shortly.</p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="mt-10 text-sm font-bold uppercase tracking-widest text-[#28593b]"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#28593b]/60 ml-2">Name</label>
                    <input required type="text" placeholder="Your Name" className="w-full rounded-2xl border border-[#28593b]/10 bg-[#f9faf9] px-6 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#28593b]/60 ml-2">Phone</label>
                    <input required type="tel" placeholder="10-digit Mobile" className="w-full rounded-2xl border border-[#28593b]/10 bg-[#f9faf9] px-6 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#28593b]/60 ml-2">Email Address</label>
                  <input required type="email" placeholder="partner@example.com" className="w-full rounded-2xl border border-[#28593b]/10 bg-[#f9faf9] px-6 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#28593b]/60 ml-2">Address</label>
                  <input required type="text" placeholder="Your full address" className="w-full rounded-2xl border border-[#28593b]/10 bg-[#f9faf9] px-6 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#28593b]/60 ml-2">Pincode</label>
                  <input required type="text" placeholder="Enter Pincode" className="w-full rounded-2xl border border-[#28593b]/10 bg-[#f9faf9] px-6 py-4 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus === "submitting"}
                  className="w-full rounded-2xl bg-[#18241c] py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-[#28593b]"
                >
                  {formStatus === "submitting" ? "Sending..." : "Submit Interest"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
export default PartnerPage;
