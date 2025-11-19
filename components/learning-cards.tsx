"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"

interface Card {
  number: string
  title: string
  description: string
}

const cards: Card[] = [
  {
    number: "01",
    title: "Communicate with Clarity",
    description: "Learn how to organize your thoughts, structure your message, and speak with purpose and flow.",
  },
  {
    number: "02",
    title: "Build Unshakable Confidence",
    description: "Overcome self-doubt and develop a confident presence that commands attention in any room.",
  },
  {
    number: "03",
    title: "Master Body Language & Voice",
    description:
      "Use tone, gestures, and eye contact to project credibility and connect authentically with your audience.",
  },
  {
    number: "04",
    title: "Lead Through Communication",
    description: "Learn how to speak as a leader — not just to be heard, but to inspire trust and create impact.",
  },
]

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState("0")
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return

    const numericValue = Number.parseInt(value) || 0
    let current = 0
    const increment = Math.ceil(numericValue / 50)
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(String(current).padStart(2, "0"))
      }
    }, 10)

    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{displayValue}</span>
}

export default function LearningCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#a855f7] mb-4 inline-block border-b-4 border-[#a855f7] pb-2">
          WHAT YOU'LL LEARN
        </h2>
        <p className="text-gray-600 text-base md:text-lg mt-6 max-w-2xl font-poppins">
          Practical tools, proven frameworks, and powerful techniques to transform the way you speak and lead.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`p-6 md:p-8 border-2 border-gray-200 rounded-lg hover:border-[#a855f7] hover:shadow-lg transition-all duration-300 ${
              index === 3 ? "md:col-span-2 lg:col-span-1 lg:col-start-4" : ""
            }`}
          >
            <div className="mb-6">
              <span className="text-3xl md:text-4xl font-bold text-[#a855f7]">
                <AnimatedNumber value={card.number} />
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-poppins">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
