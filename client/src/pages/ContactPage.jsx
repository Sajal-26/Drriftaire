import { motion } from "framer-motion";

function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f6f4ee] px-6 py-14 text-[#243328] lg:px-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="mx-auto max-w-4xl"
      >
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="text-sm font-semibold uppercase tracking-[0.24em] text-[#28593b]"
        >
          Get in Touch
        </motion.p>
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-4 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl"
        >
          We're here to help you grow.
        </motion.h1>
        <motion.div 
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
          className="mt-10 rounded-[2rem] border border-[#28593b]/10 bg-white p-8 shadow-[0_24px_60px_-30px_rgba(40,89,59,0.35)]"
        >
          <p className="text-lg leading-8 text-[#55665a]">
            For operational support, partnership inquiries, or general questions about our
            drone services, reach out to us at:
          </p>
          <div className="mt-8">
            <motion.a
              whileHover={{ scale: 1.02 }}
              href="mailto:support@drriftaire.com"
              className="inline-block text-2xl font-bold text-[#28593b] hover:underline"
            >
              support@drriftaire.com
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default ContactPage;
