// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { supabaseBrowser } from "@/lib/supabase-course";
// import { Video, Upload, Trash2, RefreshCcw } from "lucide-react";

// type Assignment = {
//   id: string;
//   course_id: string;
//   module_id: string;
//   title: string;
//   description: string | null;
//   submission_type: "video" | "file" | "text";
//   min_duration_seconds: number | null;
//   max_duration_seconds: number | null;
//   prompt_cloudflare_video_id: string | null;
// };

// type Submission = {
//   id: string;
//   assignment_id: string;
//   submission_type: "video" | "file" | "text";
//   cloudflare_video_id: string | null;
//   storage_file_path: string | null;
//   text_answer: string | null;
//   duration_seconds: number | null;
//   status: string;
// };

// export default function AssignmentPanel({
//   assignment,
//   onCompleted,
// }: {
//   assignment: Assignment;
//   onCompleted: () => void; // tells parent to refresh progress/UI
// }) {
//   const supa = supabaseBrowser();
//   const [userId, setUserId] = useState<string | null>(null);
//   const [submission, setSubmission] = useState<Submission | null>(null);
//   const [loading, setLoading] = useState(true);

//   // recording state
//   const [canRecord, setCanRecord] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<BlobPart[]>([]);
//   const streamRef = useRef<MediaStream | null>(null);
//   const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // ---------- load auth + existing submission ----------
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       const { data: auth } = await supa.auth.getUser();
//       if (!auth.user) {
//         setLoading(false);
//         return;
//       }
//       setUserId(auth.user.id);

//       const { data: sub } = await supa
//         .from("assignment_submissions")
//         .select("*")
//         .eq("assignment_id", assignment.id)
//         .eq("user_id", auth.user.id)
//         .maybeSingle();

//       setSubmission(sub as any);
//       setLoading(false);
//     })();
//   }, [assignment.id]);

//   // ---------- check recording capability ----------
//   useEffect(() => {
//     const ok =
//       typeof window !== "undefined" &&
//       !!navigator.mediaDevices?.getUserMedia &&
//       typeof MediaRecorder !== "undefined";
//     setCanRecord(ok);
//   }, []);

//   // ---------- start recording ----------
//   const startRecording = async () => {
//     setError(null);
//     if (!canRecord) {
//       setError(
//         "Recording not supported on this device. Please upload a video."
//       );
//       return;
//     }
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       streamRef.current = stream;

//       if (videoPreviewRef.current) {
//         videoPreviewRef.current.srcObject = stream;
//         videoPreviewRef.current.play().catch(() => {});
//       }

//       // const rec = new MediaRecorder(stream, {
//       //   mimeType: "video/webm;codecs=vp8,opus",
//       // });

//       const pickMimeType = () => {
//         const types = [
//           "video/webm;codecs=vp9,opus",
//           "video/webm;codecs=vp8,opus",
//           "video/webm",
//           "video/mp4", // Safari may support mp4
//         ];
//         for (const t of types) {
//           if ((MediaRecorder as any).isTypeSupported?.(t)) return t;
//         }
//         return "";
//       };

//       const mimeType = pickMimeType();
//       const rec = mimeType
//         ? new MediaRecorder(stream, { mimeType })
//         : new MediaRecorder(stream);

//       chunksRef.current = [];
//       rec.ondataavailable = (e) => {
//         if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
//       };
//       rec.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "video/webm" });
//         setRecordedBlob(blob);
//       };

//       mediaRecorderRef.current = rec;
//       rec.start();
//       setRecording(true);
//     } catch (e: any) {
//       setError(
//         e.message?.includes("Permission")
//           ? "Camera/mic permission denied. Please allow access or upload a video."
//           : "Could not access camera/mic. Please upload a video."
//       );
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
//     setRecording(false);
//   };

//   // ---------- upload flow (recorded blob OR file input) ----------
//   const uploadVideo = async (blob: Blob, durationSeconds?: number) => {
//     if (!userId) return;
//     setUploading(true);
//     setError(null);
//     try {
//       // 1) ask server for direct upload url
//       const r = await fetch("/api/cloudflare/direct-upload", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           meta: {
//             assignmentId: assignment.id,
//             userId,
//             courseId: assignment.course_id,
//           },
//         }),
//       });
//       const { uploadURL, uid, error: apiErr } = await r.json();
//       if (apiErr) throw new Error(apiErr);

//       // 2) PUT blob to uploadURL
//       const upRes = await fetch(uploadURL, {
//         method: "PUT",
//         body: blob,
//       });
//       if (!upRes.ok) throw new Error("Video upload failed");

//       // 3) upsert submission
//       const { data: sub, error: subErr } = await supa
//         .from("assignment_submissions")
//         .upsert(
//           {
//             assignment_id: assignment.id,
//             course_id: assignment.course_id,
//             user_id: userId,
//             submission_type: "video",
//             cloudflare_video_id: uid,
//             duration_seconds: durationSeconds ?? null,
//             status: "submitted",
//           },
//           { onConflict: "assignment_id,user_id" }
//         )
//         .select("*")
//         .single();

//       if (subErr) throw subErr;
//       setSubmission(sub as any);

//       // 4) mark progress complete for assignment (we’ll add assignment_id to progress later)
//       await supa.from("progress").upsert(
//         {
//           user_id: userId,
//           course_id: assignment.course_id,
//           assignment_id: assignment.id,
//           is_completed: true,
//         } as any,
//         { onConflict: "user_id,assignment_id" as any }
//       );

//       onCompleted();
//       setRecordedBlob(null);
//     } catch (e: any) {
//       setError(e.message ?? "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFilePick = async (file: File) => {
//     // simple duration unknown for mp4; optional to extract later
//     await uploadVideo(file);
//   };

//   const deleteSubmission = async () => {
//     if (!submission || !userId) return;
//     await supa
//       .from("assignment_submissions")
//       .delete()
//       .eq("id", submission.id)
//       .eq("user_id", userId);

//     setSubmission(null);

//     // also un-complete progress (optional)
//     await supa
//       .from("progress")
//       .delete()
//       .eq("user_id", userId)
//       .eq("assignment_id", assignment.id);

//     onCompleted();
//   };

//   if (loading) return <div className="text-xs text-gray-500">Loading…</div>;

//   const minSecs = assignment.min_duration_seconds ?? 0;

//   return (
//     <div className="space-y-4 text-xs">
//       <div>
//         <h3 className="text-base font-semibold text-gray-900">
//           Assignment: {assignment.title}
//         </h3>
//         {assignment.description && (
//           <p className="text-gray-600 mt-1 whitespace-pre-line">
//             {assignment.description}
//           </p>
//         )}
//         {minSecs > 0 && (
//           <p className="mt-2 text-[11px] text-purple-700">
//             Note: Speak at least {Math.ceil(minSecs / 60)} minutes.
//           </p>
//         )}
//       </div>

//       {/* Prompt video (if instructor uploaded) */}
//       {assignment.prompt_cloudflare_video_id && (
//         <div className="rounded-2xl overflow-hidden bg-black aspect-video">
//           <iframe
//             src={`https://iframe.videodelivery.net/${assignment.prompt_cloudflare_video_id}`}
//             className="w-full h-full border-0"
//             allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
//             allowFullScreen
//           />
//         </div>
//       )}

//       {/* Existing submission view */}
//       {submission?.cloudflare_video_id ? (
//         <div className="space-y-2">
//           <div className="rounded-2xl overflow-hidden bg-black aspect-video">
//             <iframe
//               src={`https://iframe.videodelivery.net/${submission.cloudflare_video_id}`}
//               className="w-full h-full border-0"
//               allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
//               allowFullScreen
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={deleteSubmission}
//               className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-4 py-2 font-semibold hover:bg-red-100"
//             >
//               <Trash2 className="h-4 w-4" /> Delete submission
//             </button>

//             <label className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 font-semibold cursor-pointer hover:bg-black">
//               <RefreshCcw className="h-4 w-4" />
//               Replace video
//               <input
//                 type="file"
//                 accept="video/*"
//                 className="hidden"
//                 onChange={(e) =>
//                   e.target.files?.[0] && handleFilePick(e.target.files[0])
//                 }
//               />
//             </label>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Record section */}
//           <div className="rounded-2xl border border-gray-200 p-3 space-y-2">
//             <div className="flex items-center gap-2 font-semibold text-gray-800">
//               <Video className="h-4 w-4 text-purple-600" />
//               Record your video
//             </div>

//             {!canRecord && (
//               <p className="text-[11px] text-gray-500">
//                 Recording isn’t available on this device/browser. Please upload
//                 a pre-recorded video below.
//               </p>
//             )}

//             {canRecord && (
//               <div className="space-y-2">
//                 <video
//                   ref={videoPreviewRef}
//                   className="w-full rounded-xl bg-black aspect-video"
//                   muted
//                   playsInline
//                 />

//                 <div className="flex gap-2">
//                   {!recording ? (
//                     <button
//                       onClick={startRecording}
//                       className="rounded-full bg-purple-600 text-white px-4 py-2 font-semibold hover:bg-purple-700"
//                     >
//                       Start recording
//                     </button>
//                   ) : (
//                     <button
//                       onClick={stopRecording}
//                       className="rounded-full bg-gray-900 text-white px-4 py-2 font-semibold hover:bg-black"
//                     >
//                       Stop recording
//                     </button>
//                   )}
//                 </div>

//                 {recordedBlob && (
//                   <div className="space-y-2">
//                     <p className="text-[11px] text-gray-600">
//                       Recording ready. Review and submit:
//                     </p>
//                     <video
//                       src={URL.createObjectURL(recordedBlob)}
//                       controls
//                       className="w-full rounded-xl bg-black aspect-video"
//                     />
//                     <button
//                       disabled={uploading}
//                       onClick={() => uploadVideo(recordedBlob)}
//                       className="rounded-full bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
//                     >
//                       {uploading ? "Uploading..." : "Submit recording"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Upload section */}
//           <div className="rounded-2xl border border-gray-200 p-3 space-y-2">
//             <div className="flex items-center gap-2 font-semibold text-gray-800">
//               <Upload className="h-4 w-4 text-purple-600" />
//               Upload a recorded video
//             </div>

//             <label className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-white cursor-pointer hover:bg-black w-fit">
//               Choose video
//               <input
//                 type="file"
//                 accept="video/*"
//                 className="hidden"
//                 onChange={(e) =>
//                   e.target.files?.[0] && handleFilePick(e.target.files[0])
//                 }
//               />
//             </label>
//           </div>
//         </>
//       )}

//       {error && (
//         <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-[11px]">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-course";
import {
  Video,
  Upload,
  Trash2,
  RefreshCcw,
  Pause,
  Play,
  Square,
  TimerReset,
} from "lucide-react";

type Assignment = {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string | null;
  submission_type: "video" | "file" | "text";
  min_duration_seconds: number | null;
  max_duration_seconds: number | null;
  prompt_cloudflare_video_id: string | null;
};

type Submission = {
  id: string;
  assignment_id: string;
  submission_type: "video" | "file" | "text";
  cloudflare_video_id: string | null;
  storage_file_path: string | null;
  text_answer: string | null;
  duration_seconds: number | null;
  status: string;
};

export default function AssignmentPanel({
  assignment,
  onCompleted,
  hideHeader = false,
}: {
  assignment: Assignment;
  onCompleted: () => void;
  hideHeader?: boolean;
}) {
  const supa = supabaseBrowser();

  const [userId, setUserId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // recording state
  const [canRecord, setCanRecord] = useState(false);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minSecs = assignment.min_duration_seconds ?? 0;
  const maxSecs = assignment.max_duration_seconds ?? 0;

  // ---------- load auth + existing submission ----------
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: auth } = await supa.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }
      setUserId(auth.user.id);

      const { data: sub } = await supa
        .from("assignment_submissions")
        .select("*")
        .eq("assignment_id", assignment.id)
        .eq("user_id", auth.user.id)
        .maybeSingle();

      setSubmission(sub as any);
      setLoading(false);
    })();
  }, [assignment.id]);

  // ---------- check recording capability ----------
  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined";
    setCanRecord(ok);
  }, []);

  const pickMimeType = () => {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    for (const t of types) {
      // @ts-ignore
      if (MediaRecorder.isTypeSupported?.(t)) return t;
    }
    return "";
  };

  // ---------- countdown then record ----------
  const startCountdownThenRecord = async () => {
    setError(null);

    if (!canRecord) {
      setError("Recording not supported. Please upload a video.");
      return;
    }

    setCountdown(5);
    let c = 5;

    const tick = window.setInterval(() => {
      c -= 1;
      if (c <= 0) {
        window.clearInterval(tick);
        setCountdown(null);
        startRecording();
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  // ---------- start recording ----------
  const startRecording = async () => {
    setError(null);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        await videoPreviewRef.current.play();
      }

      const mimeType = pickMimeType();
      const rec = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current = rec;
      rec.start();
      setRecording(true);
      setPaused(false);

      // timer
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setElapsed((s) => {
          const next = s + 1;
          if (maxSecs > 0 && next >= maxSecs) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (e: any) {
      setError(
        e.message?.includes("Permission")
          ? "Camera/mic permission denied. Allow access or upload a video."
          : "Could not access camera/mic. Please upload a video."
      );
      setCountdown(null);
    }
  };

  const pauseRecording = () => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state !== "recording") return;
    rec.pause();
    setPaused(true);
  };

  const resumeRecording = () => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state !== "paused") return;
    rec.resume();
    setPaused(false);
  };

  const stopRecording = () => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();

    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;

    setRecording(false);
    setPaused(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // ---------- upload flow (recorded blob OR file input) ----------
  const uploadVideo = async (blob: Blob, durationSeconds?: number) => {
    if (!userId) return;
    setUploading(true);
    setError(null);

    try {
      const r = await fetch("/api/cloudflare/direct-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxDurationSeconds: assignment.max_duration_seconds ?? undefined,
          meta: {
            assignmentId: assignment.id,
            userId,
            courseId: assignment.course_id,
          },
        }),
      });

      const { uploadURL, uid, error: apiErr } = await r.json();
      if (apiErr) throw new Error(apiErr);

      // ✅ POST multipart/form-data (not PUT)
      const form = new FormData();
      form.append("file", blob, "assignment.webm");

      const upRes = await fetch(uploadURL, {
        method: "POST",
        body: form,
      });

      if (!upRes.ok) throw new Error("Video upload failed");

      const { data: sub, error: subErr } = await supa
        .from("assignment_submissions")
        .upsert(
          {
            assignment_id: assignment.id,
            course_id: assignment.course_id,
            user_id: userId,
            submission_type: "video",
            cloudflare_video_id: uid,
            duration_seconds: durationSeconds ?? elapsed ?? null,
            status: "submitted",
          },
          { onConflict: "assignment_id,user_id" }
        )
        .select("*")
        .single();

      if (subErr) throw subErr;

      setSubmission(sub as any);
      setRecordedBlob(null);
      setRecordedUrl(null);
      onCompleted();
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFilePick = async (file: File) => {
    await uploadVideo(file);
  };

  const deleteSubmission = async () => {
    if (!submission || !userId) return;

    await supa
      .from("assignment_submissions")
      .delete()
      .eq("id", submission.id)
      .eq("user_id", userId);

    setSubmission(null);
    onCompleted();
  };

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (loading) return <div className="text-xs text-gray-500">Loading…</div>;

  return (
    <div className="space-y-4 text-xs">
      {!hideHeader && (
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Assignment: {assignment.title}
          </h3>
          {assignment.description && (
            <p className="text-gray-600 mt-1 whitespace-pre-line">
              {assignment.description}
            </p>
          )}
          {minSecs > 0 && (
            <p className="mt-2 text-[11px] text-purple-700">
              Note: Speak at least {Math.ceil(minSecs / 60)} minutes.
            </p>
          )}
        </div>
      )}

      {/* Prompt video */}
      {assignment.prompt_cloudflare_video_id && (
        <div className="rounded-2xl overflow-hidden bg-black aspect-video">
          <iframe
            src={`https://iframe.videodelivery.net/${assignment.prompt_cloudflare_video_id}`}
            className="w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* If already submitted */}
      {submission?.cloudflare_video_id ? (
        <div className="space-y-2">
          <div className="rounded-2xl overflow-hidden bg-black aspect-video">
            <iframe
              src={`https://iframe.videodelivery.net/${submission.cloudflare_video_id}`}
              className="w-full h-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={deleteSubmission}
              className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-4 py-2 font-semibold hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Delete submission
            </button>

            <label className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 font-semibold cursor-pointer hover:bg-black">
              <RefreshCcw className="h-4 w-4" />
              Replace video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFilePick(e.target.files[0])
                }
              />
            </label>
          </div>
        </div>
      ) : (
        <>
          {/* Record section */}
          <div className="rounded-2xl border border-gray-200 p-3 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Video className="h-4 w-4 text-purple-600" />
              Record your video
            </div>

            {!canRecord && (
              <p className="text-[11px] text-gray-500">
                Recording isn’t available on this device/browser. Please upload
                a pre-recorded video below.
              </p>
            )}

            {canRecord && (
              <div className="space-y-2">
                <div className="relative w-full rounded-xl bg-black aspect-video overflow-hidden">
                  <video
                    ref={videoPreviewRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />

                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 grid place-items-center bg-black/70">
                      <div className="text-white text-5xl font-bold">
                        {countdown}
                      </div>
                      <div className="text-white text-sm mt-2">Get ready…</div>
                    </div>
                  )}

                  {/* Recording timer overlay */}
                  {recording && countdown === null && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      {formatTime(elapsed)}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {!recording ? (
                    <button
                      onClick={startCountdownThenRecord}
                      className="rounded-full bg-purple-600 text-white px-4 py-2 font-semibold hover:bg-purple-700 inline-flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" /> Start recording
                    </button>
                  ) : (
                    <>
                      {!paused ? (
                        <button
                          onClick={pauseRecording}
                          className="rounded-full bg-gray-100 text-gray-900 px-4 py-2 font-semibold hover:bg-gray-200 inline-flex items-center gap-2"
                        >
                          <Pause className="h-4 w-4" /> Pause
                        </button>
                      ) : (
                        <button
                          onClick={resumeRecording}
                          className="rounded-full bg-gray-100 text-gray-900 px-4 py-2 font-semibold hover:bg-gray-200 inline-flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" /> Resume
                        </button>
                      )}

                      <button
                        onClick={stopRecording}
                        className="rounded-full bg-gray-900 text-white px-4 py-2 font-semibold hover:bg-black inline-flex items-center gap-2"
                      >
                        <Square className="h-4 w-4" /> Stop
                      </button>

                      <button
                        onClick={() => {
                          stopRecording();
                          setRecordedBlob(null);
                          setRecordedUrl(null);
                          setElapsed(0);
                        }}
                        className="rounded-full bg-red-50 text-red-700 px-4 py-2 font-semibold hover:bg-red-100 inline-flex items-center gap-2"
                      >
                        <TimerReset className="h-4 w-4" /> Reset
                      </button>
                    </>
                  )}
                </div>

                {/* Preview + submit */}
                {recordedBlob && recordedUrl && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-600">
                      Recording ready. Review and submit:
                    </p>
                    <video
                      src={recordedUrl}
                      controls
                      className="w-full rounded-xl bg-black aspect-video"
                    />
                    <button
                      disabled={uploading || (minSecs > 0 && elapsed < minSecs)}
                      onClick={() => uploadVideo(recordedBlob, elapsed)}
                      className="rounded-full bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Submit recording"}
                    </button>

                    {minSecs > 0 && elapsed < minSecs && (
                      <p className="text-[11px] text-red-600">
                        Minimum required: {Math.ceil(minSecs / 60)} min
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload section */}
          <div className="rounded-2xl border border-gray-200 p-3 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Upload className="h-4 w-4 text-purple-600" />
              Upload a recorded video
            </div>

            <label className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-white cursor-pointer hover:bg-black w-fit">
              Choose video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFilePick(e.target.files[0])
                }
              />
            </label>

            {uploading && (
              <p className="text-[11px] text-gray-500">
                Uploading… please wait.
              </p>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-[11px]">
          {error}
        </div>
      )}
    </div>
  );
}
