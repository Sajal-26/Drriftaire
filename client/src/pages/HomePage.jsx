import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

function HomePage() {
  return (
    <main className="w-full text-[#243328]">
      {/* Hero with video background */}
      <div className="relative min-h-[calc(100vh-96px)] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0"
        >
          <source src="/0404.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[1] bg-white/30 pointer-events-none" />
        <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-20">
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
          className="flex flex-col justify-center"
        >
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="text-sm font-semibold uppercase tracking-[0.28em] text-[#28593b]"
          >
            Smart Drone Agriculture
          </motion.p>
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl lg:text-6xl"
          >
            Faster, safer crop spraying built for modern farms.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white"
          >
            Drriftaire helps farms book drone operations with less friction, better
            planning, and a cleaner digital workflow from inquiry to completion.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/booking"
                className="inline-block rounded-full bg-[#28593b] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#1f4930]"
              >
                Book a Service
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="inline-block rounded-full border border-[#28593b]/20 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#28593b] no-underline transition hover:border-[#28593b]/40"
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-[2rem] border border-[#28593b]/10 bg-white p-6 shadow-[0_30px_80px_-32px_rgba(40,89,59,0.35)] sm:p-8"
        >
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#eef3ec,#f6f1ff)] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4b1f8a]">
              Why it works
            </p>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.6 }
                }
              }}
              className="mt-6 grid gap-4"
            >
              {highlights.map((item) => (
                <motion.article
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: 5 }}
                  className="rounded-[1.25rem] border border-white/70 bg-white/80 p-5"
                >
                  <h2 className="text-xl font-bold text-[#1d2b21]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#56675b]">
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
      <section className="relative z-10 bg-[#f6f4ee] py-20 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl grid gap-14 items-center lg:grid-cols-[340px_1fr]">
          
          {/* Left – pill-shaped image collage */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex gap-4 justify-center lg:justify-start"
          >
            {/* Left column – two small pills stacked */}
            <div className="flex flex-col gap-4">
              <div className="w-[140px] h-[150px] rounded-[2.5rem] overflow-hidden shadow-lg">
                <img
                  src="/wheat-field.png"
                  alt="Golden wheat field"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-[140px] h-[170px] rounded-[2.5rem] overflow-hidden shadow-lg">
                <img
                  src="/drone-spraying.png"
                  alt="Drone spraying crops"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#28593b]/30" />
              </div>
            </div>
            {/* Right column – one tall pill with overlay text */}
            <div className="relative w-[180px] h-[335px] rounded-[2.5rem] overflow-hidden shadow-lg mt-4">
              <img
                src="/farm-landscape.png"
                alt="Scenic farmland"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a24]/70 via-transparent to-transparent flex items-end justify-center pb-6">
                <p className="text-white text-sm font-bold uppercase tracking-[0.2em] text-center leading-5">
                  Farming<br />Made Smart
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right – text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-[#18241c] sm:text-4xl">
              What is Drriftaire?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#55665a]">
              Drriftaire is a comprehensive platform for drone spraying in Indian
              agriculture, making advanced technology accessible to farmers. It
              empowers rural partners as drone operators, ensuring efficient,
              cost-effective, and sustainable farming solutions — from booking to
              field execution.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
