"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CoursesHero() {
  return (
    <section className="relative isolate min-h-[50vh] overflow-hidden bg-gradient-to-br from-purple-700 via-fuchsia-700 to-indigo-400 text-white py-12 md:py-20 lg:py-24">
      {/* Soft grid + glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:px-8 md:py-20"
      >
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm"
        >
          Explore Our Courses
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-3xl font-bold leading-tight md:text-5xl"
        >
          Level up your communication, confidence & leadership.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="max-w-3xl text-sm text-white/90 md:text-base"
        >
          Curated, practical courses designed to help you speak clearly, lead
          with presence, and make an impact. Start with a free preview, then
          unlock the full path when you’re ready.
        </motion.p>

        <motion.a
          href="#catalog"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-md transition hover:shadow-lg"
        >
          Browse all courses
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </motion.a>
      </motion.div>

      {/* floating shapes */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/20 blur-2xl"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
    </section>
  );
}
