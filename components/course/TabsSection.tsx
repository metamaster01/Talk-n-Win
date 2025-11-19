// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";

// export default function TabsSection({ courseId }: { courseId: string }) {
//   const tabs = ["Overview", "Curriculum", "Instructor", "Reviews"];
//   const [active, setActive] = useState("Overview");
//   return (
//     <div className="mt-8">
//       <div className="border-b">
//         <div className="-mb-px flex gap-6 overflow-x-auto">
//           {tabs.map((t) => (
//             <button
//               key={t}
//               onClick={() => setActive(t)}
//               className={`relative px-1 py-3 text-sm font-medium ${
//                 active === t ? "text-purple-700" : "text-neutral-500"
//               }`}
//             >
//               {t}
//               {active === t && (
//                 <motion.span
//                   layoutId="tab-underline"
//                   className="absolute inset-x-0 -bottom-px h-0.5 bg-purple-600"
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TabsSection({}: {}) {
  const refs = {
    Overview: "overview-section",
    Curriculum: "curriculum-section",
    Instructor: "instructor-section",
    Reviews: "reviews-section",
  };

  type TabKey = keyof typeof refs;
  const tabs: TabKey[] = ["Overview", "Curriculum", "Instructor", "Reviews"];
  const [active, setActive] = useState<TabKey>("Overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const id = visible.target.id;
          const matched = tabs.find((t) => refs[t] === id);
          if (matched) setActive(matched);
        }
      },
      { threshold: 0.4 }
    );

    Object.values(refs).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (tab: TabKey) => {
    const id = refs[tab];
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-20 mt-8 bg-white/70 backdrop-blur">
      <div className="border-b">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => scrollToSection(t)}
              className={`relative px-1 py-3 text-sm font-medium ${
                active === t ? "text-purple-700" : "text-neutral-500"
              }`}
            >
              {t}
              {active === t && (
                <motion.span
                  layoutId="underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-purple-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
