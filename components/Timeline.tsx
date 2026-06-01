"use client";

import { motion } from "framer-motion";

interface TimelineEntry {
  date: string;
  title: string;
  organization: string;
  detail: string;
}

const Timeline = () => {
  const entries: TimelineEntry[] = [
    {
      date: "2024 – Present",
      title: "Frontend Developer Student",
      organization: "01Edu Learn2Earn",
      detail:
        "Quest-based programming curriculum covering Go, frontend development, and collaborative projects.",
    },
    {
      date: "2024 – Present",
      title: "Co-founder",
      organization: "247 Sparkle Laundry & Cleaning Services",
      detail:
        "Building a web platform for home services with booking, payments, and real-time features.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="experience"
      className="section-container px-4 py-20 max-w-4xl mx-auto w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <motion.h2 variants={itemVariants} className="text-center gradient-text mb-16">
          Experience & Timeline
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-gold hidden md:block"
          />

          {/* Timeline Items */}
          {entries.map((entry, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`mb-12 md:mb-20 relative flex md:${
                idx % 2 === 0 ? "flex-row-reverse" : "flex-row"
              } gap-8`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full hidden md:block gold-glow" />

              {/* Content */}
              <div className="w-full md:w-1/2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6"
                >
                  <p className="text-gold text-sm font-semibold mb-2">
                    {entry.date}
                  </p>
                  <h3 className="text-xl font-bold text-text mb-1">
                    {entry.title}
                  </h3>
                  <p className="text-gold-light text-sm mb-3">
                    {entry.organization}
                  </p>
                  <p className="text-muted text-sm leading-relaxed">
                    {entry.detail}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Timeline;
