"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Sparkles, Clock, Users, Video, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Initialize Supabase (you'll use your env vars)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface DemoClass {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_url: string | null;
  price: number;
  duration_minutes: number;
  instructor_name: string;
  features: string[];
  what_you_learn: string[];
  next_session_date: string | null;
  max_participants: number | null;
}

export default function DemoClassShowcase() {
  const router = useRouter();
  const [demoClass, setDemoClass] = useState<DemoClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    fetchDemoClass();
  }, []);

  const fetchDemoClass = async () => {
    try {
      const { data, error } = await supabase
        .from("demo_classes")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      setDemoClass(data);

      // Get enrollment count
      const { count } = await supabase
        .from("demo_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("demo_class_id", data.id);

      setEnrolledCount(count || 0);
    } catch (err) {
      console.error("Error fetching demo class:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (demoClass) {
      router.push(`/demo-checkout/${demoClass.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-fuchsia-500"></div>
      </div>
    );
  }

  if (!demoClass) return null;

  const isFree = demoClass.price === 0;
  const priceDisplay = isFree ? "FREE" : `₹${demoClass.price}`;

  return (
    <section id="demo-class" className="relative overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 py-16 px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 border border-fuchsia-200 mb-4">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              LIMITED SPOTS AVAILABLE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {demoClass.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {demoClass.short_description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Image & Quick Info */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <div className="aspect-video bg-gradient-to-br from-fuchsia-400 to-purple-600 relative">
                {demoClass.thumbnail_url ? (
                  <img
                    src={demoClass.thumbnail_url}
                    alt={demoClass.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-20 w-20 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE SESSION
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm">
                  <p className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                    {priceDisplay}
                  </p>
                  {!isFree && (
                    <p className="text-xs text-gray-500 line-through">₹999</p>
                  )}
                </div>

                {/* Instructor */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {/* {demoClass.instructor_name.charAt(0)}
                     */}
                    <Image src="/trupti.jpg" alt="trupti warjurkar" width={30} height={30} className="rounded-full"  />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Instructor</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demoClass.instructor_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <Clock className="h-6 w-6 text-fuchsia-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-semibold text-gray-900">
                  {demoClass.duration_minutes} mins
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Enrolled</p>
                <p className="text-sm font-semibold text-gray-900">
                  {enrolledCount}+ students
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-sm font-semibold text-gray-900">4.9/5</p>
              </div>
            </div>
          </div>

          {/* Right: Details & CTA */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Description */}
            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About This Demo
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {demoClass.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What You'll Learn
              </h3>
              <div className="space-y-3">
                {demoClass.what_you_learn.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-fuchsia-50 to-purple-50 border border-fuchsia-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What's Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoClass.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle className="h-4 w-4 text-fuchsia-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleEnrollClick}
              className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isFree ? "Book Your Free Spot" : "Enroll Now"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {isFree && (
              <p className="text-center text-xs text-gray-500">
                🎉 No payment required • Instant access
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}