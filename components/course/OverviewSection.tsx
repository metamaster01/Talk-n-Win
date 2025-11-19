"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import type { PublicCourse } from "@/lib/supabase-course";

export default function OverviewSection({ course }: { course: PublicCourse }) {
  return (
    <section id="overview-section" className="mt-10 scroll-mt-24">
      {/* Lecture Description */}
      <h3 className="text-lg font-semibold">Lectures Description</h3>

      <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">
        {course.overview_lecture_description}
      </p>

      {/* What You’ll Learn */}
      {course.overview_what_you_will_learn &&
        course.overview_what_you_will_learn.length > 0 && (
          <div className="mt-8 rounded-2xl bg-purple-50 p-6">
            <h4 className="text-base font-semibold mb-4">
              What You’ll Learn
            </h4>
            <ul className="space-y-3">
              {course.overview_what_you_will_learn.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                  <span className="text-neutral-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Who Should Enroll */}
      {course.overview_who_should_enroll &&
        course.overview_who_should_enroll.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold">Who Should Enroll?</h3>
            <ul className="mt-4 space-y-3">
              {course.overview_who_should_enroll.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Highlights */}
      {course.overview_highlights &&
        course.overview_highlights.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold">Course Highlights</h3>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-neutral-700">
              {course.overview_highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
    </section>
  );
}
