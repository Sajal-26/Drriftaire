import { motion } from "framer-motion";
import { useState } from "react";
import API_BASE_URL from "../config/api";
import { sanitizePhone, normalizePhoneInput } from "../utils/phone";
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
function ContactPage() {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(normalizePhoneInput(e.target.value));
  };

  const handlePhoneBlur = () => {
    setPhone(sanitizePhone(phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone,
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/contact/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setPhone("");
        e.target.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="relative w-full min-h-[calc(100vh-96px)] bg-[#f6f4ee] text-[#243328] overflow-hidden cursor-default">
      {}
      <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none opacity-40">
        <img src="/contact-accent.png" alt="" className="w-full h-full object-cover blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-20 lg:grid-cols-[1fr_1.2fr]"
        >
          {}
          <motion.div variants={fadeInUp}>
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] text-[#28593b]">Get in Touch</p>
            <h1 className="mt-4 sm:mt-6 text-3xl font-extrabold tracking-tight text-[#18241c] sm:text-6xl leading-[1.1]">
              Connecting the<br className="hidden sm:block" /> field to the future.
            </h1>
            <p className="mt-8 sm:mt-10 text-base sm:text-lg leading-relaxed text-[#55665a] max-w-lg">
              Whether you're a farmer looking to optimize your yield or an
              entrepreneur interested in our drone pilot network, we're ready
              to discuss how we can grow together.
            </p>
            <div className="mt-12 sm:mt-16 space-y-8 sm:space-y-12">
              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#28593b]/10 text-lg sm:text-xl">✉️</div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#28593b]/60">Email Us</p>
                  <a href="mailto:support@drriftaire.com" className="mt-1 block text-base sm:text-2xl font-bold text-[#18241c] hover:text-[#28593b] transition-colors break-words cursor-pointer">
                    support@drriftaire.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#28593b]/10 text-lg sm:text-xl">📍</div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#28593b]/60">Regional Presence</p>
                  <p className="mt-1 text-lg sm:text-2xl font-bold text-[#18241c] leading-tight">
                    Serving across India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          {}
          <motion.div
            variants={fadeInUp}
            className="relative group rounded-[2.5rem] sm:rounded-[4rem] bg-gradient-to-br from-white to-[#fcfdfa] p-6 sm:p-12 shadow-[0_45px_100px_-25px_rgba(40,89,59,0.15),0_10px_20px_-5px_rgba(40,89,59,0.05)] border border-[#28593b]/5 overflow-hidden"
          >
            {}
            <div className="absolute top-0 inset-x-0 h-2 bg-[#28593b]" />
            {}
            <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-[#18241c]/[0.02] pointer-events-none select-none italic">
              D
            </div>
            <div className="relative z-10">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#18241c]">Send us a message</h3>
                <p className="mt-2 text-sm text-[#55665a]">We typically respond within 24 hours.</p>
                {isSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Message sent successfully! We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="grid gap-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#28593b]/60 ml-2 transition-colors group-focus-within/input:text-[#28593b]">Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-[#28593b]/5 bg-[#f9faf9] px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#28593b]/5 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#28593b]/60 ml-2 transition-colors group-focus-within/input:text-[#28593b]">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border-[#28593b]/5 bg-[#f9faf9] px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#28593b]/5 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#28593b]/60 ml-2 transition-colors group-focus-within/input:text-[#28593b]">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none border-r border-[#28593b]/10 pr-4 my-3">
                      <span className="text-lg mr-2">🇮🇳</span>
                      <span className="text-sm font-bold text-[#18241c]">+91</span>
                    </div>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      placeholder="10-digit mobile"
                      className="w-full rounded-2xl border border-[#28593b]/5 bg-[#f9faf9] pl-28 pr-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#28593b]/5 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#28593b]/60 ml-2 transition-colors group-focus-within/input:text-[#28593b]">Message</label>
                  <textarea
                    required
                    rows="4"
                    name="message"
                    placeholder="How can we help your farm?"
                    className="w-full rounded-3xl border border-[#28593b]/5 bg-[#f9faf9] px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#28593b]/5 transition-all duration-300 resize-none"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: "#1f4930",
                    boxShadow: "0 20px 40px -10px rgba(40,89,59,0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#28593b] py-6 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-xl shadow-[#28593b]/20 transition-all duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
export default ContactPage;
