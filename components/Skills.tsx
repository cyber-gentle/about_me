"use client";

import { motion } from "framer-motion";
import { FiCode, FiTool } from "react-icons/fi";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiGo,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGit,
  SiFigma,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

interface Skill {
  name: string;
  level: number;
  category: "Languages" | "Frameworks" | "Tools";
  icon: React.ReactNode;
}

const Skills = () => {
  const skills: Skill[] = [
    { name: "HTML", level: 85, category: "Languages", icon: <SiHtml5 /> },
    { name: "CSS", level: 80, category: "Languages", icon: <SiCss3 /> },
    {
      name: "JavaScript",
      level: 70,
      category: "Languages",
      icon: <SiJavascript />,
    },
    { name: "Go", level: 55, category: "Languages", icon: <SiGo /> },
    { name: "React", level: 65, category: "Frameworks", icon: <SiReact /> },
    {
      name: "Next.js",
      level: 60,
      category: "Frameworks",
      icon: <SiNextdotjs />,
    },
    {
      name: "Tailwind CSS",
      level: 75,
      category: "Frameworks",
      icon: <SiTailwindcss />,
    },
    { name: "Git", level: 70, category: "Tools", icon: <SiGit /> },
    { name: "VS Code", level: 90, category: "Tools", icon: <VscVscode /> },
    { name: "Figma", level: 50, category: "Tools", icon: <SiFigma /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="skills"
      className="section-container px-4 py-20 max-w-6xl mx-auto w-full"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <motion.h2
          variants={cardVariants}
          className="text-center gradient-text mb-16"
        >
          Skills & Technologies
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="glass-card group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl text-gold group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <div>
                  <p className="font-semibold text-text">{skill.name}</p>
                  <p className="text-xs text-muted">{skill.category}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-gradient-gold"
                />
              </div>
              <p className="text-xs text-gold mt-2 font-semibold">
                {skill.level}%
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;
