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

function ContactPage() {
  return (
    <main className="relative w-full min-h-[calc(100vh-96px)] bg-[#f6f4ee] text-[#243328] overflow-hidden">
      {/* Background Accent */}
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
          {/* Left: Contact Info */}
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
                  <a href="mailto:support.drriftaire@gmail.com" className="mt-1 block text-base sm:text-2xl font-bold text-[#18241c] hover:text-[#28593b] transition-colors break-words">
                    support.drriftaire@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#28593b]/10 text-lg sm:text-xl">📍</div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#28593b]/60">Regional Presence</p>
                  <p className="mt-1 text-lg sm:text-2xl font-bold text-[#18241c] leading-tight">
                    Serving 12+ States Across India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            variants={fadeInUp}
            className="rounded-[2.5rem] sm:rounded-[3rem] bg-white p-6 sm:p-12 shadow-[0_40px_100px_-32px_rgba(40,89,59,0.2)] border border-[#28593b]/5"
          >
            <form className="grid gap-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#28593b]/60 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#28593b]/60 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#28593b]/60 ml-1">Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we help your farm?"
                  className="w-full rounded-3xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm focus:border-[#28593b]/30 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#1f4930" }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl bg-[#28593b] py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-[#28593b]/20 transition-all duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

export default ContactPage;
