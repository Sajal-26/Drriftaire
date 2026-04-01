import { motion } from "framer-motion";

function WhyUsPage() {
  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f6f4ee] px-6 py-14 text-[#243328] lg:px-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="mx-auto max-w-4xl"
      >
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="text-sm font-semibold uppercase tracking-[0.24em] text-[#28593b]"
        >
          Why Drriftaire
        </motion.p>
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-4 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl"
        >
          Reliability in every flight.
        </motion.h1>
        <motion.div 
          className="mt-8 space-y-8"
        >
          {[
            { t: "Deep Rural Focus", d: "We understand that field work requires specific coordination, not just generic logistics." },
            { t: "Transparent Tracking", d: "From inquiry to completion, every step of the service is documented and visible." }
          ].map(item => (
            <motion.div 
              key={item.t} 
              variants={{ hidden: { opacity: 0, x: -25 }, visible: { opacity: 1, x: 0 } }}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="rounded-[1.5rem] border border-[#28593b]/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-[#1d2b21]">{item.t}</h2>
              <p className="mt-3 text-base leading-7 text-[#55665a]">{item.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}

export default WhyUsPage;
