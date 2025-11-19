"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Lock, Play, FileText } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import AuthDialog from "./AuthDialog";

function supa() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Lesson = {
  id: string;
  title: string;
  is_preview: boolean;
  content_type: "video" | "pdf" | "text" | "quiz";
  duration_seconds: number;
  module_id: string;
};

type Module = { id: string; title: string; position: number };

export default function Curriculum({ courseId }: { courseId: string }) {
  const [mods, setMods] = useState<Module[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<
    Record<string, Lesson[]>
  >({});
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const client = supa();
    (async () => {
      const { data: modules } = await client
        .from("modules")
        .select("id,title,position")
        .eq("course_id", courseId)
        .order("position");
      setMods(modules || []);
      const { data: lessons } = await client
        .from("lessons")
        .select("id,title,is_preview,content_type,duration_seconds,module_id")
        .eq("course_id", courseId)
        .order("position");
      const grouped: Record<string, Lesson[]> = {};
      (lessons || []).forEach((l: any) => {
        grouped[l.module_id] = grouped[l.module_id] || [];
        grouped[l.module_id].push(l);
      });
      setLessonsByModule(grouped);
    })();
  }, [courseId]);

  const handleLessonClick = async (lesson: Lesson) => {
    const client = supa();
    const { data } = await client.auth.getUser();
    if (!lesson.is_preview) {
      if (!data.user) {
        setAuthOpen(true);
        return;
      }
      // TODO: call /api/has-access?lessonId=... (checks enrollment). For now show a lock.
      alert("This lecture is locked. Complete purchase to watch.");
      return;
    }
    // TODO: navigate to player or open demo player modal
  };

  return (
    <div className="mt-10">
      <h3 className="mb-3 text-lg font-semibold">Curriculum</h3>
      <div className="divide-y rounded-2xl border">
        {mods.map((m) => (
          <details key={m.id} className="group">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
              <span className="font-medium">{m.title}</span>
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-1 bg-neutral-50 px-4 py-2">
              {(lessonsByModule[m.id] || []).map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLessonClick(l)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {l.content_type === "video" ? (
                      <Play className="h-4 w-4 text-purple-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-purple-600" />
                    )}
                    {l.title}
                    {!l.is_preview && (
                      <Lock className="h-3 w-3 text-neutral-400" />
                    )}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {Math.max(1, Math.round(l.duration_seconds / 60))}m
                  </span>
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
