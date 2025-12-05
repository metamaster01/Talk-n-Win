"use client";

import { useEffect, useState } from "react";
import { supabaseServer } from "@/lib/supabase-course";
import { 
  Sparkles, Clock, Users, Video, CheckCircle, ArrowRight, Star,
  Award, Target, TrendingUp, Shield, Zap,
  Calendar, MapPin, ChevronDown, ChevronUp, PlayCircle,
  Gift, Heart, BookOpen, Lightbulb
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TestimonialsSection from "@/components/testimonial-section";
import InstructorSection from "@/components/course/InstructorSection";

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

export default function DemoClassLandingPage() {
  const router = useRouter();
  const [demoClass, setDemoClass] = useState<DemoClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchDemoClass();
  }, []);

  const fetchDemoClass = async () => {
    try {
      const { data, error } = await supabaseServer()
        .from("demo_classes")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      setDemoClass(data);

      // Get enrollment count
      const { count } = await supabaseServer()
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (!demoClass) return null;

  const isFree = demoClass.price === 0;
  const priceDisplay = isFree ? "FREE" : `₹${demoClass.price}`;
  const spotsLeft = demoClass.max_participants ? demoClass.max_participants - enrolledCount : 50;

  // Static FAQs
  const faqs = [
    {
      question: "Is this demo class really in 99 Rs?",
      answer: "Yes! This demo class is available in 99 Rs with no hidden charges. We want you to experience the quality of our teaching before committing to a full course."
    },
    {
      question: "What do I need to join the session?",
      answer: "You'll need a laptop or desktop with a stable internet connection, and a Zoom account (free). We'll send you the meeting link 24 hours before the session starts."
    },
    {
      question: "Will I get a recording of the session?",
      answer: "Absolutely! All registered participants will receive a recording link within 24 hours after the session ends. The recording will be available for 7 days."
    },
    {
      question: "Can I ask questions during the demo?",
      answer: "Yes! We encourage questions. There will be dedicated Q&A segments throughout the session, and you can also use the chat to ask questions anytime."
    },
    {
      question: "What happens after the demo class?",
      answer: "After the demo, you'll receive information about our full courses, special offers for demo attendees, and additional learning resources. There's no obligation to enroll."
    }
  ];

  // Static Why Choose Us
  const whyChooseUs = [
    {
      icon: Award,
      title: "Expert Instruction",
      description: "Learn from industry professionals with years of real-world experience"
    },
    {
      icon: Target,
      title: "Practical Focus",
      description: "Hands-on exercises and real projects, not just theory"
    },
    {
      icon: Users,
      title: "Small Batches",
      description: "Limited participants ensure personalized attention and interaction"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Skills that are in high demand and boost your career prospects"
    },
    {
      icon: Shield,
      title: "Risk-Free",
      description: "Try before you commit with our demo session"
    },
    {
      icon: Zap,
      title: "Fast Results",
      description: "Start applying what you learn from day one"
    }
  ];

  // Static Timeline
  const timeline = [
    {
      title: "Register",
      description: "Sign up for the demo session in just 30 seconds",
      icon: BookOpen
    },
    {
      title: "Get Ready",
      description: "Receive Zoom link and prep materials 24hrs before",
      icon: Calendar
    },
    {
      title: "Join Live",
      description: "Attend the interactive session",
      icon: Video
    },
    {
      title: "Apply & Grow",
      description: "Get resources, recording, and next steps",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 mt-14">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Badge */}
          <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 border border-fuchsia-200 shadow-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-600 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                {enrolledCount}+ STUDENTS JOINED • {spotsLeft} SPOTS LEFT
              </span>
            </div>
          </div>

          {/* Main Hero */}
          <div className={`text-center mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {demoClass.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              {demoClass.short_description}
            </p>
            
            {/* Session Info Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {demoClass.next_session_date && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                  <Calendar className="h-4 w-4 text-fuchsia-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(demoClass.next_session_date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">10:00 AM - 12:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                <MapPin className="h-4 w-4 text-pink-600" />
                <span className="text-sm font-medium text-gray-700">Zoom (Link sent after signup)</span>
              </div>
            </div>

            <button
              onClick={handleEnrollClick}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Gift className="h-6 w-6" />
                Claim Your Spot Now
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              Join {enrolledCount}+ students who've already registered
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                      <PlayCircle className="h-24 w-24 text-white opacity-50 group-hover:opacity-70 transition-opacity group-hover:scale-110 transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Live badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-lg">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                    LIVE SESSION
                  </div>

                  {/* Price badge */}
                  <div className="absolute top-4 right-4 px-5 py-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                    <p className="text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                      {priceDisplay}
                    </p>
                    {!isFree && <p className="text-sm text-gray-500 line-through">₹999</p>}
                  </div>

                  {/* Instructor */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 px-5 py-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      <Image src="/trupti.jpg" alt={demoClass.instructor_name} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Your Instructor</p>
                      <p className="text-sm font-bold text-gray-900">{demoClass.instructor_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <Clock className="h-7 w-7 text-fuchsia-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="text-base font-bold text-gray-900">{demoClass.duration_minutes} mins</p>
                </div>
                <div className="text-center p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <Users className="h-7 w-7 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Enrolled</p>
                  <p className="text-base font-bold text-gray-900">{enrolledCount}+ students</p>
                </div>
                <div className="text-center p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <Star className="h-7 w-7 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                  <p className="text-xs text-gray-500 font-medium">Rating</p>
                  <p className="text-base font-bold text-gray-900">4.9/5</p>
                </div>
              </div>
            </div>

            {/* Right: Details & Features */}
            <div className="space-y-6 animate-slide-in-right">
              {/* Description */}
              <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Demo
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {demoClass.description}
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What You'll Learn
                </h3>
                <div className="space-y-4">
                  {demoClass.what_you_learn.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-sm">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <p className="text-base text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-fuchsia-50 to-purple-50 border border-fuchsia-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demoClass.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-base text-gray-700 p-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 text-fuchsia-600 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleEnrollClick}
                className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-5 text-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isFree ? "Reserve My Spot - It's Free!" : "Enroll Now"}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {isFree && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 font-medium">
                    🎉 100% Secure • No Credit Card Required • Instant Access
                  </p>
                  {demoClass.max_participants && (
                    <p className="text-xs text-gray-500">
                      Limited to {demoClass.max_participants} participants per session
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="relative py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Simple steps to transform your skills</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                
                {idx < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-fuchsia-300 -ml-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best learning experience with practical, career-focused education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-fuchsia-100 to-purple-100 text-fuchsia-600 mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Got questions? We've got answers!</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-6 w-6 text-fuchsia-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-6 animate-fade-in">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 justify-center">


      <InstructorSection />
      </div>

      <TestimonialsSection />

      {/* Final CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-fuchsia-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-6">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-semibold">Last Chance to Join!</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of students who've transformed their careers. This demo session is your first step towards mastery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={handleEnrollClick}
              className="group relative overflow-hidden rounded-full bg-white px-10 py-5 text-xl font-bold text-fuchsia-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Claim Your Spot
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}