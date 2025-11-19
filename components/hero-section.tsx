// "use client";

// import { motion } from "framer-motion";
// import { ChevronRight } from "lucide-react";

// export default function HeroSection() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const imageVariants = {
//     hidden: { opacity: 0, x: 50, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       scale: 1,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   return (
//     <section className="pt-32 pb-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 min-h-screen flex items-center relative overflow-hidden">
//       <div className=" mx-auto pl-4 sm:pl-6 md:pl-8 w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
//           {/* Left Content */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="text-white z-10"
//           >
//             {/* Main Headline */}
//             <motion.h1
//               variants={itemVariants}
//               className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-balance"
//             >
//               Speak to Win.
//               <br />
//               <span className="text-black drop-shadow-sm">Lead with</span>
//               <br />
//               <span className="text-black drop-shadow-sm">Confidence.</span>
//             </motion.h1>

//             {/* Subtitle */}
//             <motion.p
//               variants={itemVariants}
//               className="text-base md:text-lg text-white/90 mb-8 max-w-lg leading-relaxed"
//             >
//               Discover "Talk & Win" — a results-driven communication mastery
//               program designed to help you speak with clarity, influence, and
//               unstoppable confidence.
//             </motion.p>

//             {/* CTA Buttons */}
//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row gap-4 sm:gap-4"
//             >
//               <motion.button
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="px-8 py-3 md:py-4 bg-black text-white rounded-full font-bold text-base md:text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
//               >
//                 Join the Program
//                 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </motion.button>

//               <motion.button
//                 whileHover={{
//                   scale: 1.05,
//                   backgroundColor: "rgba(255,255,255,0.95)",
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="px-8 py-3 md:py-4 bg-white text-purple-600 rounded-full font-bold text-base md:text-lg border-2 border-white hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
//               >
//                 Explore Courses
//                 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </motion.button>
//             </motion.div>

//             {/* Stats or Trust Indicators */}
//             <motion.div
//               variants={itemVariants}
//               className="mt-12 flex flex-wrap gap-8"
//             >
//               {[
//                 { number: "10K+", label: "Students" },
//                 { number: "95%", label: "Success Rate" },
//                 { number: "50+", label: "Courses" },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={stat.label}
//                   whileHover={{ scale: 1.05 }}
//                   className="flex flex-col"
//                 >
//                   <span className="text-2xl md:text-3xl font-bold text-white">
//                     {stat.number}
//                   </span>
//                   <span className="text-white/80 text-sm md:text-base">
//                     {stat.label}
//                   </span>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Right Image - Removed floating animation, positioned in bottom-right */}
//           <motion.div
//             variants={imageVariants}
//             initial="hidden"
//             animate="visible"
//             className="relative hidden lg:block"
//           >
//             <div className="relative z-10">
//               <div className="rounded-3xl overflow-hidden shadow-2xl">
//                 <img
//                   src="/hero-1.png"
//                   alt="Professional Women in Conversation"
//                   className="w-full h-auto object-cover"
//                   loading="lazy"
//                 />
//               </div>
//             </div>

//             {/* Decorative Elements */}
//             <motion.div
//               animate={{
//                 rotate: 360,
//                 scale: [1, 1.1, 1],
//               }}
//               transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
//               className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
//             />
//             <motion.div
//               animate={{
//                 rotate: -360,
//                 scale: [1, 1.05, 1],
//               }}
//               transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
//               className="absolute -bottom-20 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
//             />
//           </motion.div>
//         </div>

//         {/* Scroll Indicator */}
//         {/* <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//           className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//         >
//           <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
//             <motion.div
//               animate={{ y: [0, 6, 0] }}
//               transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//               className="w-1 h-2 bg-white rounded-full"
//             />
//           </div>
//         </motion.div> */}
//       </div>
//     </section>
//   );
// }

"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { BackgroundPaths } from "./ui/shadcn-io/background-paths"

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="pt-32 pb-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 min-h-screen flex items-center relative overflow-hidden">
      {/* <BackgroundPaths /> */}
      <div className="mx-auto pl-4 sm:pl-6 md:pl-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
          {/* Left Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-white z-10 pl-0 lg:pl-10">
            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-balance"
              style={{
                fontSize: "64px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                lineHeight: "75px",
              }}
            >
              Speak to Win.
              <br />
              <span className="text-black drop-shadow-sm">Lead with</span>
              <br />
              <span className="text-black drop-shadow-sm">Confidence.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-white/90 mb-8 max-w-lg leading-relaxed"
              style={{
                fontSize: "18px",
                fontFamily: "Poppins",
                fontWeight: 400,
                lineHeight: "100%",
              }}
            >
              Discover "Talk & Win" — a results-driven communication mastery program designed to help you speak with
              clarity, influence, and unstoppable confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 md:py-4 bg-black text-white rounded-full font-bold text-base md:text-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Join the Program
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.95)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 md:py-4 bg-white text-purple-600 rounded-full font-bold text-base md:text-lg border-2 border-white hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Explore Courses
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Stats or Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-8">
              {[
                { number: "10K+", label: "Students" },
                { number: "95%", label: "Success Rate" },
                { number: "50+", label: "Courses" },
              ].map((stat, index) => (
                <motion.div key={stat.label} whileHover={{ scale: 1.05 }} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-white">{stat.number}</span>
                  <span className="text-white/80 text-sm md:text-base">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image - Changed to w-140 h-140, removed decorative blur circles, added pl to allow right edge to touch screen */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="absolute bottom-0 right-0 hidden lg:block"
          >
            <div className="w-140 h-140">
              <div
                className="relative w-full h-full overflow-hidden shadow-2xl"
                style={{ borderRadius: "40px 0 0 40px" }}
              >
                <img
                  src="/hero-1.png"
                  alt="Professional Women in Conversation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
