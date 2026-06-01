"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  image?: string;
}

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "ASCII Art Generator",
      description:
        "Terminal-style tool that renders text using ASCII banner fonts for creative terminal outputs.",
      stack: ["Go", "CLI"],
      github: "https://github.com",
      image: "/images/projects/ascii-art.png",
    },
    {
      id: 2,
      title: "Go Reloaded",
      description:
        "Text transformation engine handling formatting tags and punctuation rules with precision.",
      stack: ["Go"],
      github: "https://github.com",
      image: "/images/projects/go-reloaded.png",
    },
    {
      id: 3,
      title: "247 Sparkle Web App",
      description:
        "Home services platform with booking, real-time chat, and integrated payment processing.",
      stack: ["Next.js", "Node.js", "PostgreSQL"],
      github: "https://github.com",
      live: "https://example.com",
      image: "/images/projects/247-sparkle.png",
    },
  ];

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="projects"
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
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="glass-card group flex flex-col h-full"
            >
              {/* Project Image */}
              <div className="w-full h-48 bg-gradient-to-br from-gold/10 to-gold-light/5 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="text-6xl font-bold text-gold/20 group-hover:scale-110 transition-transform">
                  {project.id}
                </div>
              </div>

              {/* Project Details */}
              <h3 className="text-xl font-bold mb-2 text-text">{project.title}</h3>
              <p className="text-muted text-sm mb-4 flex-grow">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full border border-gold/30 text-gold/80 bg-gold/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-border-gold">
                {project.github && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                  >
                    <Github size={18} />
                    <span className="text-sm">GitHub</span>
                  </motion.a>
                )}
                {project.live && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gold-light hover:text-gold transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm">Live Demo</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
