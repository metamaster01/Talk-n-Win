"use client"

import { motion } from "motion/react"
import { HoverEffect } from "./hover-effect"
import { Lightbulb, Briefcase, Megaphone, TrendingUp, Zap, Heart } from "lucide-react"

export default function ProgramTargetSection() {
  const targetAudience = [
    {
      title: "Curious",
      description: "You want to learn and improve how you speak.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
    {
      title: "Corporate",
      description: "You want to talk confidently at work or in meetings.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
    {
      title: "Coach or Creator",
      description: "You want to share your message clearly with others.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <Megaphone className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
    {
      title: "Career Builder",
      description: "You want to speak better in interviews and grow your career.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
    {
      title: "Change-Maker",
      description: "You want to inspire and lead people with your voice.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <Zap className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
    {
      title: "Courage-Seeker",
      description: "You want to overcome fear and speak with confidence.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
          <Heart className="w-6 h-6 text-purple-600" />
        </div>
      ),
    },
  ]

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-purple-600 mb-4 font-space-grotesk"
          >
            Who This Program Is For?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-700 text-base leading-relaxed font-poppins"
          >
            Designed for individuals ready to amplify their voice, presence, and impact — in every space they step into.
          </motion.p>
        </div>

        {/* Cards with Hover Effect */}
        <HoverEffect items={targetAudience} />
      </div>
    </section>
  )
}
