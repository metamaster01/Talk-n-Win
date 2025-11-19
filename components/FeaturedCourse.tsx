"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { easeInOut, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PublicCourse } from "../lib/supabase-course";

export type FeaturedCoursesProps = {
  courses: PublicCourse[];
  title?: string;
};

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  inView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.4 } },
};

const arrowVariants = {
  rest: { x: 6, opacity: 0 },
  hover: { x: 0, opacity: 1, transition: { duration: 0.25 } },
};

function formatWeeks(minutes?: number | null) {
  if (!minutes) return "—";
  const weeks = Math.max(1, Math.round(minutes / (60 * 7 * 4)) || 1);
  return `${weeks} Weeks`;
}

export default function FeaturedCourses({
  courses,
  title = "Featured Courses",
}: FeaturedCoursesProps) {
  return (
    <section className="w-full px-4 md:px-14 lg:px-24 py-12 md:py-16 lg:py-20">
      <div className="mb-6 flex items-end gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>
        <div className="h-1 w-24 rounded bg-purple-500/60" />
      </div>

      {/* Grid: 2 cols on mobile, 3 on lg+ */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
        {courses.map((c, idx) => (
          <motion.article
            key={c.id}
            variants={cardVariants}
            initial="initial"
            whileInView="inView"
            viewport={{ once: true, amount: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <motion.div
              className="relative h-40 w-full overflow-hidden md:h-44"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {c.thumbnail_url && (
                <motion.div variants={imageVariants} className="h-full w-full">
                  <Image
                    src={c.thumbnail_url}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                    unoptimized
                  />
                </motion.div>
              )}
              {/* Top-left pill for category or level */}
              <div className="absolute left-3 top-3 rounded-full bg-purple-600/90 px-2.5 py-1 text-xs font-medium text-white shadow">
                {c.category_name ?? "Course"}
              </div>
            </motion.div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-4">
              <div className="text-xs text-neutral-500">
                by {c.author_name ?? "Instructor"}
              </div>

              <Link
                href={`/courses/${c.slug}`}
                className="line-clamp-2 text-base font-semibold leading-snug text-purple-700 hover:underline"
              >
                {c.title}
              </Link>

              <p className="line-clamp-2 text-sm text-neutral-600">
                {c.short_description}
              </p>

              {/* Meta row */}
              <div className="mt-1 flex items-center gap-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
                  {formatWeeks(c.duration_minutes)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
                  {c.students_count} Students
                </div>
              </div>

              {/* Price row */}
              <div className="mt-1 flex items-center gap-2">
                {c.mrp && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{Number(c.mrp).toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-sm font-semibold text-neutral-900">
                  ₹{Number(c.price).toLocaleString("en-IN")}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-2">
                <Link
                  href={`/courses/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-purple-600 hover:text-purple-700"
                >
                  <span>View Course</span>
                  <motion.span variants={arrowVariants} className="-mr-1">
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
