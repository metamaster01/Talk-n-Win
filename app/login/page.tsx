// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import Lottie from "lottie-react";
// // import Image from "next/image";
// // import { createClient } from "@supabase/supabase-js";
// // import { Loader2 } from "lucide-react";

// // // ---------- Supabase client (browser) ----------
// // function supabaseServer() {
// //   return createClient(
// //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// //   );
// // }

// // // ---------- Types ----------
// // type Mode = "signup" | "login";

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const [mode, setMode] = useState<Mode>("signup");
// //   const [animationData, setAnimationData] = useState<any>(null);

// //   const [fullName, setFullName] = useState("");
// //   const [phone, setPhone] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Load Lottie JSON from public folder
// //   useEffect(() => {
// //     fetch("/Welcome-animation.json")
// //       .then((res) => res.json())
// //       .then(setAnimationData)
// //       .catch((err) => console.error("Failed to load Lottie:", err));
// //   }, []);

// //   const switchMode = (next: Mode) => {
// //     setMode(next);
// //     setError(null);
// //   };

// //   // ---------- Google auth ----------
// //   const handleGoogleSignIn = async () => {
// //     setError(null);
// //     setLoading(true);
// //     const supabase = supabaseServer();
// //     try {
// //       const { error } = await supabase.auth.signInWithOAuth({
// //         provider: "google",
// //         options: {
// //           // After Google, Supabase will send user to /dashboard
// //           redirectTo: `${window.location.origin}/dashboard`,
// //         },
// //       });
// //       if (error) {
// //         setError(error.message);
// //       }
// //       // No need to do anything else: user will be redirected.
// //     } catch (err: any) {
// //       setError(err.message ?? "Something went wrong with Google sign-in.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ---------- Email/password submit ----------
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError(null);
// //     setLoading(true);

// //     const supabase = supabaseServer();

// //     try {
// //       if (mode === "signup") {
// //         // Sign up
// //         const { data, error } = await supabase.auth.signUp({
// //           email,
// //           password,
// //           options: {
// //             data: {
// //               full_name: fullName,
// //               phone,
// //             },
// //           },
// //         });

// //         if (error) {
// //           setError(error.message);
// //           setLoading(false);
// //           return;
// //         }

// //         // Optional: upsert profile row (if you don't already have DB trigger)
// //         if (data.user) {
// //           await supabase.from("profiles").upsert({
// //             id: data.user.id,
// //             full_name: fullName,
// //             email: email,
// //             phone: phone || null,
// //           });
// //         }

// //         // Redirect to dashboard (or you can use /courses)
// //         router.push("/dashboard");
// //       } else {
// //         // Login
// //         const { data, error } = await supabase.auth.signInWithPassword({
// //           email,
// //           password,
// //         });

// //         if (error) {
// //           setError(error.message);
// //           setLoading(false);
// //           return;
// //         }

// //         if (data.session) {
// //           router.push("/dashboard");
// //         }
// //       }
// //     } catch (err: any) {
// //       console.error(err);
// //       setError(err.message ?? "Something went wrong. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const title =
// //     mode === "signup" ? "Create your account" : "Welcome back";
// //   const subtitle =
// //     mode === "signup"
// //       ? "Fill in the details to get started."
// //       : "Log in to continue your learning journey.";

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 flex items-center justify-center px-4 py-8">
// //       <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
// //         {/* LEFT: Lottie / illustration */}
// //         <div className="relative hidden md:flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-800 p-8">
// //           {animationData ? (
// //             <Lottie
// //               animationData={animationData}
// //               loop
// //               autoplay
// //               className="w-full max-w-md"
// //             />
// //           ) : (
// //             <div className="flex flex-col items-center justify-center text-purple-50">
// //               <Loader2 className="h-8 w-8 animate-spin" />
// //               <p className="mt-2 text-xs opacity-80">
// //                 Loading animation...
// //               </p>
// //             </div>
// //           )}
// //           {/* Cute robot or logo overlay (optional) */}
// //           <div className="pointer-events-none absolute bottom-6 left-8 flex items-center gap-3">
// //             <div className="relative h-14 w-14">
// //               <Image
// //                 src="/bot.png" // optional mascot if you have one
// //                 alt="Bot"
// //                 fill
// //                 className="object-contain drop-shadow-lg"
// //               />
// //             </div>
// //             <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-purple-50 backdrop-blur">
// //               <p className="font-semibold">Hey there 👋</p>
// //               <p className="text-xs opacity-80">
// //                 Log in to pick up right where you left off.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* MOBILE LOTTIE (top, smaller) */}
// //         <div className="md:hidden flex flex-col items-center pt-6">
// //           {animationData && (
// //             <Lottie
// //               animationData={animationData}
// //               loop
// //               autoplay
// //               className="w-48"
// //             />
// //           )}
// //         </div>

// //         {/* RIGHT: Form */}
// //         <div className="flex flex-col px-6 py-8 md:px-10">
// //           {/* Header */}
// //           <div className="mb-6 text-center md:text-left">
// //             <h1 className="text-2xl font-semibold text-neutral-900">
// //               {title}
// //             </h1>
// //             <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
// //           </div>

// //           {/* Google button */}
// //           <button
// //             type="button"
// //             disabled={loading}
// //             onClick={handleGoogleSignIn}
// //             className="flex items-center justify-center gap-3 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition disabled:opacity-60"
// //           >
// //             <GoogleLogo />
// //             <span>Continue with Google</span>
// //           </button>

// //           {/* Divider */}
// //           <div className="my-4 flex items-center gap-3">
// //             <span className="h-px flex-1 bg-neutral-200" />
// //             <span className="text-[11px] uppercase tracking-wide text-neutral-400">
// //               or continue with email
// //             </span>
// //             <span className="h-px flex-1 bg-neutral-200" />
// //           </div>

// //           {/* Error */}
// //           {error && (
// //             <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
// //               {error}
// //             </div>
// //           )}

// //           {/* Form */}
// //           <form onSubmit={handleSubmit} className="space-y-3">
// //             {mode === "signup" && (
// //               <>
// //                 <Field
// //                   label="Full name"
// //                   value={fullName}
// //                   onChange={(e) => setFullName(e.target.value)}
// //                   placeholder="Enter your full name"
// //                 />
// //                 <Field
// //                   label="Phone"
// //                   value={phone}
// //                   onChange={(e) => setPhone(e.target.value)}
// //                   placeholder="+91XXXXXXXXXX"
// //                 />
// //               </>
// //             )}

// //             <Field
// //               label="Email address"
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="you@example.com"
// //             />

// //             <Field
// //               label="Password"
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="••••••••"
// //             />

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition disabled:opacity-60"
// //             >
// //               {loading && (
// //                 <Loader2 className="h-4 w-4 animate-spin text-white" />
// //               )}
// //               <span>{mode === "signup" ? "Continue" : "Log in"}</span>
// //             </button>
// //           </form>

// //           {/* Footer: switch between signup and login */}
// //           <div className="mt-4 text-center text-xs text-neutral-500">
// //             {mode === "signup" ? (
// //               <>
// //                 Already have an account?{" "}
// //                 <button
// //                   type="button"
// //                   onClick={() => switchMode("login")}
// //                   className="font-semibold text-purple-600 hover:underline"
// //                 >
// //                   Log in
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 New here?{" "}
// //                 <button
// //                   type="button"
// //                   onClick={() => switchMode("signup")}
// //                   className="font-semibold text-purple-600 hover:underline"
// //                 >
// //                   Create an account
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ---------- Small components ----------

// // function Field({
// //   label,
// //   type = "text",
// //   ...props
// // }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
// //   return (
// //     <label className="block text-xs text-neutral-600">
// //       <span>{label}</span>
// //       <input
// //         type={type}
// //         className="mt-1 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
// //         {...props}
// //       />
// //     </label>
// //   );
// // }

// // function GoogleLogo() {
// //   return (
// //     <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
// //       {/* Simple G icon using four colors */}
// //       <svg viewBox="0 0 48 48" className="h-4 w-4">
// //         <path
// //           fill="#EA4335"
// //           d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.01 6.22C12.43 13.02 17.74 9.5 24 9.5z"
// //         />
// //         <path
// //           fill="#4285F4"
// //           d="M46.5 24.5c0-1.63-.15-3.2-.43-4.71H24v9.05h12.7c-.55 2.96-2.23 5.47-4.74 7.16l7.64 5.94C43.9 37.11 46.5 31.3 46.5 24.5z"
// //         />
// //         <path
// //           fill="#FBBC05"
// //           d="M10.57 28.44A14.5 14.5 0 0 1 9.5 24c0-1.54.26-3.02.73-4.4l-8.01-6.22A23.9 23.9 0 0 0 0 24c0 3.84.92 7.46 2.56 10.62l8.01-6.18z"
// //         />
// //         <path
// //           fill="#34A853"
// //           d="M24 48c6.48 0 11.92-2.13 15.89-5.82l-7.64-5.94C30.77 37.43 27.6 38.5 24 38.5c-6.26 0-11.57-3.52-14.43-8.94l-8.01 6.18C6.51 42.62 14.62 48 24 48z"
// //         />
// //       </svg>
// //     </span>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Lottie from "lottie-react";
// import Image from "next/image";
// import { createClient } from "@supabase/supabase-js";
// import { Loader2 } from "lucide-react";

// // ---------- Supabase client (browser) ----------
// function supabaseServer() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

// type Mode = "signup" | "login";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Read initial mode from query ?mode=login|signup
//   const initialMode: Mode =
//     (searchParams.get("mode") as Mode) === "login" ? "login" : "signup";

//   const [mode, setMode] = useState<Mode>(initialMode);
//   const [animationData, setAnimationData] = useState<any>(null);

//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Load Lottie JSON from public
//   useEffect(() => {
//     fetch("/Welcome-animation.json")
//       .then((res) => res.json())
//       .then(setAnimationData)
//       .catch((err) => console.error("Failed to load Lottie:", err));
//   }, []);

//   const switchMode = (next: Mode) => {
//     setMode(next);
//     setError(null);
//   };

//   // ---------- Google auth ----------
//   const handleGoogleSignIn = async () => {
//     setError(null);
//     setLoading(true);
//     const supabase = supabaseServer();
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/dashboard`,
//         },
//       });
//       if (error) setError(error.message);
//     } catch (err: any) {
//       setError(err.message ?? "Something went wrong with Google sign-in.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Email/password submit ----------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     const supabase = supabaseServer();

//     try {
//       if (mode === "signup") {
//         const { data, error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               full_name: fullName,
//               phone,
//             },
//           },
//         });

//         if (error) {
//           setError(error.message);
//           setLoading(false);
//           return;
//         }

//         if (data.user) {
//           await supabase.from("profiles").upsert({
//             id: data.user.id,
//             full_name: fullName,
//             email: email,
//             phone: phone || null,
//           });
//         }

//         router.push("/dashboard");
//       } else {
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) {
//           setError(error.message);
//           setLoading(false);
//           return;
//         }

//         if (data.session) {
//           router.push("/dashboard");
//         }
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message ?? "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const title =
//     mode === "signup" ? "Create your account" : "Welcome back";
//   const subtitle =
//     mode === "signup"
//       ? "Fill in the details to get started."
//       : "Log in to continue your learning journey.";

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-purple-50 flex items-center justify-center px-4 py-10 mt-14">
//       <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-purple-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
//         {/* LEFT: Lottie (desktop) */}
//         <div className="relative hidden md:flex items-center justify-center bg-gradient-to-b from-fuchsia-100 to-purple-100 p-8">
//           {animationData ? (
//             <Lottie
//               animationData={animationData}
//               loop
//               autoplay
//               className="w-full max-w-md drop-shadow-lg"
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center text-purple-600">
//               <Loader2 className="h-8 w-8 animate-spin" />
//               <p className="mt-2 text-xs opacity-80">
//                 Loading animation...
//               </p>
//             </div>
//           )}

//           {/* <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3">
//             <div className="relative h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center">
//               <Image
//                 src="/bot.png"
//                 alt="Assistant"
//                 fill
//                 className="object-contain p-1.5"
//               />
//             </div>
//             <div className="rounded-2xl bg-white/80 px-4 py-2 text-xs text-purple-700 shadow-sm">
//               <p className="font-semibold">Your learning buddy 🤝</p>
//               <p className="opacity-80">
//                 Sign in and we’ll pick up where you left off.
//               </p>
//             </div>
//           </div> */}
//         </div>

//         {/* MOBILE LOTTIE */}
//         <div className="md:hidden flex flex-col items-center pt-6">
//           {animationData && (
//             <Lottie
//               animationData={animationData}
//               loop
//               autoplay
//               className="w-40"
//             />
//           )}
//         </div>

//         {/* RIGHT: Form */}
//         <div className="flex flex-col px-6 py-8 md:px-10">
//           <div className="mb-6 text-center md:text-left">
//             <h1 className="text-2xl font-semibold text-neutral-900">
//               {title}
//             </h1>
//             <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
//           </div>

//           {/* Google button */}
//           <button
//             type="button"
//             disabled={loading}
//             onClick={handleGoogleSignIn}
//             className="flex items-center justify-center gap-3 rounded-full border border-purple-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:border-fuchsia-400 hover:shadow-sm transition disabled:opacity-60"
//           >
//             <GoogleLogo />
//             <span>Continue with Google</span>
//           </button>

//           {/* Divider */}
//           <div className="my-4 flex items-center gap-3">
//             <span className="h-px flex-1 bg-neutral-200" />
//             <span className="text-[11px] uppercase tracking-wide text-neutral-400">
//               or continue with email
//             </span>
//             <span className="h-px flex-1 bg-neutral-200" />
//           </div>

//           {error && (
//             <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3">
//             {mode === "signup" && (
//               <>
//                 <Field
//                   label="Full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder="Enter your full name"
//                 />
//                 <Field
//                   label="Phone"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="+91XXXXXXXXXX"
//                 />
//               </>
//             )}

//             <Field
//               label="Email address"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//             />

//             <Field
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-60"
//             >
//               {loading && (
//                 <Loader2 className="h-4 w-4 animate-spin text-white" />
//               )}
//               <span>{mode === "signup" ? "Continue" : "Log in"}</span>
//             </button>
//           </form>

//           <div className="mt-4 text-center text-xs text-neutral-500">
//             {mode === "signup" ? (
//               <>
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => switchMode("login")}
//                   className="font-semibold text-fuchsia-600 hover:underline"
//                 >
//                   Log in
//                 </button>
//               </>
//             ) : (
//               <>
//                 New here?{" "}
//                 <button
//                   type="button"
//                   onClick={() => switchMode("signup")}
//                   className="font-semibold text-fuchsia-600 hover:underline"
//                 >
//                   Create an account
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------- Small components ----------

// function Field({
//   label,
//   type = "text",
//   ...props
// }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
//   return (
//     <label className="block text-xs text-neutral-600">
//       <span>{label}</span>
//       <input
//         type={type}
//         className="mt-1 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
//         {...props}
//       />
//     </label>
//   );
// }

// function GoogleLogo() {
//   return (
//     <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
//       <svg viewBox="0 0 48 48" className="h-4 w-4">
//         <path
//           fill="#EA4335"
//           d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.01 6.22C12.43 13.02 17.74 9.5 24 9.5z"
//         />
//         <path
//           fill="#4285F4"
//           d="M46.5 24.5c0-1.63-.15-3.2-.43-4.71H24v9.05h12.7c-.55 2.96-2.23 5.47-4.74 7.16l7.64 5.94C43.9 37.11 46.5 31.3 46.5 24.5z"
//         />
//         <path
//           fill="#FBBC05"
//           d="M10.57 28.44A14.5 14.5 0 0 1 9.5 24c0-1.54.26-3.02.73-4.4l-8.01-6.22A23.9 23.9 0 0 0 0 24c0 3.84.92 7.46 2.56 10.62l8.01-6.18z"
//         />
//         <path
//           fill="#34A853"
//           d="M24 48c6.48 0 11.92-2.13 15.89-5.82l-7.64-5.94C30.77 37.43 27.6 38.5 24 38.5c-6.26 0-11.57-3.52-14.43-8.94l-8.01 6.18C6.51 42.62 14.62 48 24 48z"
//         />
//       </svg>
//     </span>
//   );
// }


"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import Image from "next/image";
// import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase-course";
import { Loader2 } from "lucide-react";

// ---------- Supabase client (browser) ----------
// function supabaseServer() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

type Mode = "signup" | "login";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode: Mode =
    (searchParams.get("mode") as Mode) === "login" ? "login" : "signup";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [animationData, setAnimationData] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/Welcome-animation.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load Lottie:", err));
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = supabaseServer();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${searchParams.get("redirect") || "/dashboard"}`,
        },
      });
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong with Google sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = supabaseServer();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
            },
          },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            email,
            phone: phone || null,
          });
        }

        // Redirect to the page user came from, or dashboard as fallback
        const redirectTo = searchParams.get("redirect") || "/dashboard";
        router.push(redirectTo);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
             const redirectTo = searchParams.get("redirect") || "/dashboard";
        router.push(redirectTo);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // This is where 'Failed to fetch' will show up if env / network is wrong
      setError(
        err?.message ??
          "Unable to reach the server. Check your internet and Supabase URL."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setInfo(null);

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setResetLoading(true);
    const supabase = supabaseServer();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setInfo(
          "If this email is registered, a password reset link has been sent."
        );
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(
        err?.message ?? "Failed to send reset email. Please try again later."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const title =
    mode === "signup" ? "Create your account" : "Welcome back";
  const subtitle =
    mode === "signup"
      ? "Fill in the details to get started."
      : "Log in to continue your learning journey.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-purple-50 flex items-center justify-center px-4 py-10 mt-14">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-purple-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Lottie (desktop) */}
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-b from-fuchsia-100 to-purple-100 p-8">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full max-w-md drop-shadow-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-purple-600">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2 text-xs opacity-80">
                Loading animation...
              </p>
            </div>
          )}

          {/* <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <Image
                src="/bot.png"
                alt="Assistant"
                fill
                className="object-contain p-1.5"
              />
            </div>
            {/* <div className="rounded-2xl bg-white/80 px-4 py-2 text-xs text-purple-700 shadow-sm">
              <p className="font-semibold">Your learning buddy 🤝</p>
              <p className="opacity-80">
                Sign in and we’ll pick up where you left off.
              </p>
            </div> 
          </div> */}
        </div>

        {/* MOBILE LOTTIE */}
        <div className="md:hidden flex flex-col items-center pt-6">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-40"
            />
          )}
        </div>

        {/* RIGHT: Form */}
        <div className="flex flex-col px-6 py-8 md:px-10">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          </div>

          {/* Google button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 rounded-full border border-purple-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:border-fuchsia-400 hover:shadow-sm transition disabled:opacity-60"
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] uppercase tracking-wide text-neutral-400">
              or continue with email
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* Info / error */}
          {info && (
            <div className="mb-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {info}
            </div>
          )}
          {error && (
            <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <Field
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <Field
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
              </>
            )}

            <Field
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Field
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* Forgot password in LOGIN mode */}
            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-[11px] font-medium text-fuchsia-600 hover:underline disabled:opacity-60"
                >
                  {resetLoading ? "Sending reset link..." : "Forgot password?"}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              )}
              <span>{mode === "signup" ? "Continue" : "Log in"}</span>
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-neutral-500">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-semibold text-fuchsia-600 hover:underline"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-semibold text-fuchsia-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

// ---------- Small components ----------

function Field({
  label,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-xs text-neutral-600">
      <span>{label}</span>
      <input
        type={type}
        className="mt-1 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
        {...props}
      />
    </label>
  );
}

function GoogleLogo() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
      <svg viewBox="0 0 48 48" className="h-4 w-4">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.01 6.22C12.43 13.02 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24.5c0-1.63-.15-3.2-.43-4.71H24v9.05h12.7c-.55 2.96-2.23 5.47-4.74 7.16l7.64 5.94C43.9 37.11 46.5 31.3 46.5 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M10.57 28.44A14.5 14.5 0 0 1 9.5 24c0-1.54.26-3.02.73-4.4l-8.01-6.22A23.9 23.9 0 0 0 0 24c0 3.84.92 7.46 2.56 10.62l8.01-6.18z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.92-2.13 15.89-5.82l-7.64-5.94C30.77 37.43 27.6 38.5 24 38.5c-6.26 0-11.57-3.52-14.43-8.94l-8.01 6.18C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    </span>
  );
}
