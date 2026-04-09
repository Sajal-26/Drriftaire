import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import API_BASE_URL from "../config/api";
import { sanitizePhone, normalizePhoneInput } from "../utils/phone";
const MAX_RESUME_SIZE = 2 * 1024 * 1024; // 2 MB
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    linkedin: "",
    resume: null,
  });
  const [resumeError, setResumeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "phone") {
      nextValue = normalizePhoneInput(value);
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handlePhoneBlur = () => {
    setFormData((prev) => ({ ...prev, phone: sanitizePhone(prev.phone) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, resume: null }));
      setResumeError("");
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setFormData((prev) => ({ ...prev, resume: null }));
      setResumeError("Resume must be 2 MB or smaller.");
      e.target.value = null;
      return;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    setResumeError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      setResumeError("Please upload a PDF or Word resume under 2 MB.");
      return;
    }

    if (formData.resume.size > MAX_RESUME_SIZE) {
      setResumeError("Resume must be 2 MB or smaller.");
      return;
    }

    setIsSubmitting(true);

    const submissionData = new FormData(e.target);

    try {
      const response = await fetch(`${API_BASE_URL}/career/apply`, {
        method: "POST",
        body: submissionData,
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        e.target.reset();
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "",
          linkedin: "",
          resume: null,
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Career form error:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
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
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 mx-auto max-w-xl bg-[#18241c] text-white p-12 rounded-[2.5rem] shadow-2xl text-center"
            >
              <div className="text-5xl mb-6">✨</div>
              <h3 className="text-3xl font-bold mb-4">Application Received!</h3>
              <p className="text-[#a8b8ac] leading-relaxed">
                Thank you for submitting your story. Our team will review your profile and reach out if there's a strong fit.
              </p>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-12 w-full mx-auto max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl text-left border border-[#d1dbc1]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-transparent focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-transparent focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none border-r border-[#28593b]/10 pr-4 my-3">
                      <span className="text-lg mr-2">🇮🇳</span>
                      <span className="text-sm font-bold text-[#18241c]">+91</span>
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handlePhoneBlur} className="w-full rounded-xl border border-transparent bg-[#f6f4ee] pl-28 pr-4 py-3 focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="10-digit mobile" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Role of Interest</label>
                  <input type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-transparent focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="e.g. Drone Pilot, Agronomist" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Address / City</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-transparent focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="Your City, State" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-transparent focus:border-[#28593b] focus:bg-white focus:outline-none transition-colors" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55665a] mb-2">Resume (PDF, Word) *</label>
                  <p className="text-[11px] text-[#55665a] mb-2">Maximum file size: 2 MB.</p>
                  <input 
                    type="file" 
                    name="resume" 
                    required 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 rounded-xl bg-[#f6f4ee] border border-dashed border-[#55665a]/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#28593b] file:text-white hover:file:bg-[#18241c] hover:border-[#28593b] transition-colors cursor-pointer text-[#55665a]" 
                  />
                  {resumeError && (
                    <p className="mt-3 text-sm text-red-600">{resumeError}</p>
                  )}
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-full bg-[#18241c] text-white font-bold py-5 px-8 text-sm uppercase tracking-widest hover:bg-[#28593b] shadow-xl disabled:opacity-70 transition-all flex items-center justify-center"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </motion.button>
            </motion.form>
          )}
        </motion.div>
        {}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
      </section>
    </main>
  );
}
export default CareersPage;
