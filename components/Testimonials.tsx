"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        "Abraham is a focused and driven developer who picks up concepts fast. Great collaborator on our Go projects.",
      author: "Treasure",
      role: "Teammate · 01Edu",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "Always shows up with ideas and energy. One of the most consistent people I've worked with.",
      author: "Victor",
      role: "Teammate · 01Edu",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "Abraham brings both technical skill and entrepreneurial thinking to everything he builds.",
      author: "Mentor",
      role: "01Edu Platform",
      rating: 5,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="testimonials"
      className="section-container px-4 py-20 max-w-6xl mx-auto w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <motion.h2 variants={cardVariants} className="text-center gradient-text mb-16">
          What People Say
        </motion.h2>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="glass-card flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted text-sm leading-relaxed mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-border-gold pt-4">
                <p className="font-semibold text-text">{testimonial.author}</p>
                <p className="text-xs text-muted">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
