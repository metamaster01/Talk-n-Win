"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"

export default function CommunicatorSection() {
  return (
    <section id="about" className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-purple-600 mb-4 font-space-grotesk"
          >
            MEET OUR COMMUNICATOR — TRUPTI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-700 text-base leading-relaxed font-poppins"
          >
            The voice behind Talk & Win — inspiring thousands to speak with clarity, confidence, and courage.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Left - Image - takes 1 column (30% of space) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/trupti.jpg"
                alt="Trupti Warjurkar - Communication Coach"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Right - Content - takes 2 columns (70% of space) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            {/* Name */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 font-space-grotesk mb-2">Trupti Warjurkar</h3>
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-gray-700 font-poppins leading-relaxed">
              <p className="text-sm">
                Trupti is a communication strategist, speaker, and coach dedicated to helping professionals unlock their
                voice and express their best selves.
              </p>
              <p className="text-sm">
                With years of experience empowering leaders and teams, she combines psychology, storytelling, and
                practical speaking techniques to transform how people communicate and connect.
              </p>
              <p className="text-sm">
                Through her signature programs — including Talk & Win and 3C's of Communication — Trupti helps
                individuals speak with purpose, influence, and impact, whether in a meeting, presentation, or on stage.
              </p>
            </div>

            {/* Credentials */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <ul className="space-y-2 text-sm text-gray-700 font-poppins">
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-3">•</span>
                  <span>Communication Coach & Confidence Mentor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-3">•</span>
                  <span>Guided 1000+ professionals and entrepreneurs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-3">•</span>
                  <span>Known for her Inspower Method — turning insight into action</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-poppins font-semibold transition-colors duration-300"
            >
              <Link href="/courses" className="text-white text-lg font-medium">
              Explore Her Courses
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
