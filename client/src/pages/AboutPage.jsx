import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
function AboutPage() {
  return (
    <main className="w-full bg-white text-[#243328]">
      { }
      <section className="relative py-24 px-6 lg:px-10 bg-[#f6f4ee] overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-2 items-center"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#28593b]">Our Story</p>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl leading-[1.1]">
                Born from the soil,<br />powered by the sky.
              </h1>
              <p className="mt-8 text-lg leading-relaxed text-[#55665a]">
                Drriftaire began with a simple observation: Indian agriculture is
                standing on the brink of a technological revolution, but access
                remains inconsistent. We set out to bridge this gap by creating
                a platform that makes industrial-grade drone technology as
                accessible as a phone call.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-[#55665a]">
                Today, we are more than just a booking service. We are a network
                of engineers, agronomists, and rural partners working together to
                ensure that every field, no matter how remote, can benefit from
                the precision of the airborne era.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-[3rem] shadow-2xl"
            >
              <img src="/farm-panoramic.png" alt="Indian Terraced Farm" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a24]/20 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>
      { }
      <section className="py-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-12 md:grid-cols-2"
          >
            <motion.div variants={fadeInUp} className="p-12 rounded-[3rem] bg-[#18241c] text-white">
              <div className="text-4xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#a8b8ac]">
                To democratize advanced agricultural technology by empowering
                local entrepreneurs and providing farmers with the precision tools
                they need to thrive in a changing climate.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-12 rounded-[3rem] border border-[#28593b]/10 bg-[#f6f4ee]">
              <div className="text-4xl mb-6">👁️</div>
              <h2 className="text-3xl font-bold text-[#18241c]">Our Vision</h2>
              <p className="mt-6 text-lg leading-relaxed text-[#55665a]">
                A future where every Indian farm is part of a connected,
                data-driven ecosystem that maximizes yields, minimizes waste,
                and restores the health of our natural environment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      { }
      <section className="py-32 px-6 lg:px-10 bg-[#18241c] overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-2 items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-2xl order-2 lg:order-1"
            >
              <img src="/rural-pilot.png" alt="Smiling Indian Farmer" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a24]/40 to-transparent" />
            </motion.div>
            <motion.div variants={fadeInUp} className="order-1 lg:order-2">

              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
                Empowering the<br />modern farmer.
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-[#a8b8ac]">
                Our goal is to put the power of precision agriculture directly into the
                hands of the people who know the land best. By simplifying drone
                operations, we are working toward a future where every farmer can
                improve their livelihood through advanced aerial insights and efficiency.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-[#a8b8ac]">
                At Drriftaire, we believe that the true value of technology lies in its
                ability to support the hard work performed in the field. Our goal is to
                ensure that the advantages of the digital age are accessible and affordable
                for every smallholder farmer across the country.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
export default AboutPage;
