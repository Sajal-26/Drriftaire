import { motion } from "framer-motion";

function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f6f4ee] px-6 py-14 text-[#243328] lg:px-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <motion.section
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="rounded-[2rem] border border-[#28593b]/10 bg-white p-8 shadow-[0_24px_70px_-30px_rgba(40,89,59,0.3)] sm:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#28593b]">
            About
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#18241c]">
            Drriftaire is shaping a cleaner booking experience for drone agriculture.
          </h1>
          <p className="mt-6 text-base leading-8 text-[#56675b]">
            The product connects field demand with operational control, making it easier
            to collect customer requests and manage service status without unnecessary
            back-and-forth.
          </p>
        </motion.section>

        <motion.section
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="rounded-[2rem] bg-[linear-gradient(135deg,#eef3ec,#f5f1ff)] p-8 sm:p-10"
        >
          <h2 className="text-2xl font-bold text-[#1d2b21]">What the platform focuses on</h2>
          <ul className="mt-6 grid gap-4 p-0 text-base leading-8 text-[#4b5b50]">
            <li className="list-none rounded-[1.25rem] bg-white/80 px-5 py-4">
              Simple booking for farmers and clients.
            </li>
            <li className="list-none rounded-[1.25rem] bg-white/80 px-5 py-4">
              Centralized admin visibility for requests and analytics.
            </li>
            <li className="list-none rounded-[1.25rem] bg-white/80 px-5 py-4">
              A frontend foundation ready for brand and product expansion.
            </li>
          </ul>
        </motion.section>
      </motion.div>
    </main>
  );
}

export default AboutPage;
