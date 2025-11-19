"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

interface StatCard {
  number: string
  label: string
  finalValue: number
}

const stats: StatCard[] = [
  { number: "5K+", label: "Active Students", finalValue: 5000 },
  { number: "10", label: "Total Courses", finalValue: 10 },
  { number: "98%", label: "Satisfaction Rate", finalValue: 98 },
]

function CounterAnimation({ targetValue, isSuffix }: { targetValue: number; isSuffix: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return

    const start = 0
    const duration = 2000
    const increment = targetValue / (duration / 16)
    let current = start

    const interval = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setDisplayValue(targetValue)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [inView, targetValue])

  return (
    <span ref={ref}>
      {displayValue}
      {isSuffix ? (targetValue === 5000 ? "" : "%") : ""}
    </span>
  )
}

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={statVariants}
            className={`bg-white rounded-lg p-8 md:p-10 text-center shadow-sm hover:shadow-md transition-shadow ${
              index === 2 ? "col-span-2 md:col-span-1 mx-auto w-full md:w-auto" : ""
            }`}
          >
            <p className="text-4xl md:text-5xl font-bold text-[#a855f7] mb-3">
              <CounterAnimation targetValue={stat.finalValue} isSuffix={index === 0 || index === 2} />
            </p>
            <p className="text-gray-700 font-semibold text-base md:text-lg">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
