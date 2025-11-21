"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

const features = [
  "Learn At Your Own Pace",
  "Practical Lessons To Boost Confidence",
  "Certificate Of Completion Provided",
  "Lifetime Access To All Modules",
]

export default function ConfidenceSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 },
    },
  }

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Image */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="order-2 md:order-1"
        >
          <Image
            src="/hero-2.png"
            alt="Learning illustration"
            width={500}
            height={500}
            className="w-full h-auto rounded-lg"
          />
        </motion.div>

        {/* Right: Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="order-1 md:order-2"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#a855f7] mb-4">
            Speak with Confidence.
          </motion.h2>
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-[#a855f7] mb-6">
            Grow Anytime, Anywhere.
          </motion.h3>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed font-poppins"
          >
            We help you build clarity, confidence, and courage — so your voice creates real impact, wherever you are.
          </motion.p>

          <motion.div variants={containerVariants} className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#a855f7] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-medium text-base md:text-lg">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
          >
            <Link href="/courses" className="text-white text-lg font-medium">
            
            Explore Course
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
