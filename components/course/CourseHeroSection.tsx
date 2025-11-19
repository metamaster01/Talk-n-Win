"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Play } from "lucide-react";

type Props = {
  title: string;
  thumbnailUrl: string | null;
  defaultVideoId: string | null; // demo lesson video id from Supabase
};

export default function CourseHeroPlayer({
  title,
  thumbnailUrl,
  defaultVideoId,
}: Props) {
  const searchParams = useSearchParams();
  const videoFromUrl = searchParams.get("video"); // set by Curriculum on preview click

  const activeVideoId = videoFromUrl || defaultVideoId || null;
  const [showPlayer, setShowPlayer] = useState<boolean>(!!videoFromUrl);

  useEffect(() => {
    if (videoFromUrl) {
      setShowPlayer(true);
    }
  }, [videoFromUrl]);

  return (
    <div id="hero-player" className="mt-6 overflow-hidden rounded-3xl">
      <div className="relative aspect-video w-full bg-black">
        {showPlayer && activeVideoId ? (
          <iframe
            src={`https://iframe.videodelivery.net/${activeVideoId}`}
            className="h-full w-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={
                thumbnailUrl ??
                "https://picsum.photos/seed/fallback/1200/675"
              }
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
            <button
              type="button"
              onClick={() => setShowPlayer(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-black/10">
                <Play className="ml-0.5 h-7 w-7 text-purple-700" />
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
