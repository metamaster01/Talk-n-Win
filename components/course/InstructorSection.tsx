"use client";

import Image from "next/image";
import { GraduationCap, Award, Users, CheckCircle2 } from "lucide-react";

export default function InstructorSection() {
  return (
    <section
      id="instructor-section"
      className="scroll-mt-24 mt-16 w-full rounded-3xl bg-white"
    >
      <h2 className="text-xl font-semibold text-neutral-900">Instructor</h2>

      <div className="mt-6 grid w-full grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
        {/* LEFT IMAGE */}
        <div className="relative h-64 w-64 md:h-72 md:w-60">
          <Image
            src="/trupti.jpg" // Replace with your instructor image
            alt="Instructor"
            fill
            className="rounded-3xl object-cover shadow-lg"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-neutral-900">
            Trupti Warjurkar
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Communication Expert • Soft Skills Coach • Public Speaking Trainer
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700">
            With 10+ years of experience in leadership coaching, communication
            training, and personality development, Trupti has helped 50,000+ 
            students unlock their true confidence and communication skills.
            His courses blend psychology, storytelling, and practical speaking 
            exercises to transform how you express yourself.
          </p>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-2 gap-5 text-sm">
            <Stat icon={<GraduationCap />} label="Courses" value="12+" />
            <Stat icon={<Award />} label="Experience" value="10+ Years" />
            <Stat icon={<Users />} label="Students" value="50,000+" />
            <Stat icon={<CheckCircle2 />} label="Rating" value="4.8/5" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
