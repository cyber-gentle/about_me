"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const About = () => {
  const [yearsLearning, setYearsLearning] = useState(0);
  const [projectsBuilt, setProjectsBuilt] = useState(0);
  const [coffee, setCoffee] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        const interval = setInterval(() => {
          setYearsLearning((prev) => (prev < 1 ? prev + 0.1 : 1));
        }, 100);
        return () => clearInterval(interval);
      }, 500),
      setTimeout(() => {
        const interval = setInterval(() => {
          setProjectsBuilt((prev) => (prev < 5 ? prev + 1 : 5));
        }, 100);
        return () => clearInterval(interval);
      }, 500),
      setTimeout(() => {
        const interval = setInterval(() => {
          setCoffee((prev) => (prev < 999 ? prev + 50 : 999));
        }, 50);
        return () => clearInterval(interval);
      }, 500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="about"
      className="section-container px-4 py-20 max-w-6xl mx-auto w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <motion.h2 variants={itemVariants} className="text-center gradient-text mb-16">
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div variants={itemVariants}>
            <p className="text-lg text-muted leading-relaxed mb-6">
              I'm a frontend developer passionate about crafting pixel-perfect
              interfaces. Currently on a journey from frontend mastery toward
              full-stack development — building real products along the way.
            </p>

            <p className="text-lg text-muted leading-relaxed mb-8">
              With a focus on creating beautiful, performant, and accessible web
              experiences, I enjoy turning designs into interactive reality. Every
              line of code is an opportunity to learn and improve.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Years Learning", value: `${Math.floor(yearsLearning)}+`, icon: "📚" },
                { label: "Projects Built", value: `${projectsBuilt}+`, icon: "🚀" },
                { label: "Coffee Cups", value: `${coffee}+`, icon: "☕" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass-card text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-gold gold-glow">
              <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold-light/10 flex items-center justify-center">
                <div className="text-6xl font-bold text-gold/50">AD</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
