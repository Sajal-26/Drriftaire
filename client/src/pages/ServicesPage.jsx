import { motion } from "framer-motion";

const services = [
  {
    title: "Crop spraying",
    description: "Consistent coverage for paddy, wheat, cotton, vegetables, and mixed plots.",
  },
  {
    title: "Scheduled operations",
    description: "Plan work around acreage, field location, and crop cycles before dispatch.",
  },
  {
    title: "Field coordination",
    description: "Keep customer data, visit timing, and job status aligned in one flow.",
  },
];

function ServicesPage() {
  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f6f4ee] px-6 py-14 text-[#243328] lg:px-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="mx-auto max-w-6xl"
      >
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="text-sm font-semibold uppercase tracking-[0.26em] text-[#28593b]"
        >
          Services
        </motion.p>
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-4 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl"
        >
          Drone operations tailored for field work.
        </motion.h1>
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="mt-6 max-w-3xl text-lg leading-8 text-[#55665a]"
        >
          The platform is centered around practical agricultural use cases, from crop
          spraying requests to scheduling and field-ready operational tracking.
        </motion.p>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.4 }
            }
          }}
          className="mt-10 grid gap-6 md:grid-cols-3"
        >
          {services.map((service) => (
            <motion.article
              key={service.title}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="rounded-[1.75rem] border border-[#28593b]/10 bg-white p-7 shadow-[0_24px_60px_-30px_rgba(40,89,59,0.35)]"
            >
              <h2 className="text-2xl font-bold text-[#1d2b21]">{service.title}</h2>
              <p className="mt-4 text-base leading-8 text-[#56675b]">
                {service.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}

export default ServicesPage;
