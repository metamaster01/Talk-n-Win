"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Phone, Mail, MapPin, Send, CheckCircle2, Sparkles, Clock } from "lucide-react";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("contact")
        .insert([formData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Contact form error:", err);
      setError("Failed to send message. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header Section */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500 animate-fade-in">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Contact</span>
          </div>

          {/* Main Heading */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 border border-fuchsia-200 mb-6 animate-fade-in animation-delay-200">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              GET IN TOUCH
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-300">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-400">
            Have a question about your course, login access, payment, or certification?
            <br />
            Our LMS support team is here to help you learn without interruptions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Contact Info */}
            <div className="space-y-6 animate-slide-in-left">
              {/* Direct Line Card */}
              <div className="rounded-3xl bg-white shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Need a direct line?
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have a question about your course, login access, payment, or certification?
                  Our LMS support team is here to help you learn without interruptions.
                </p>

                {/* Phone */}
                <div className="mb-6 group">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-fuchsia-50 to-purple-50 border border-fuchsia-100 group-hover:border-fuchsia-300 transition-all duration-300 group-hover:shadow-md">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone</h3>
                      <a
                        href="tel:+919370125066"
                        className="text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent hover:from-fuchsia-700 hover:to-purple-700 transition-all"
                      >
                        +91 93701 25066
                      </a>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        (Monday – Friday | 10 AM - 6 PM IST)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 group-hover:border-purple-300 transition-all duration-300 group-hover:shadow-md">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href="mailto:info@trupti.com"
                        className="text-lg font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-fuchsia-700 transition-all"
                      >
                        info@trupti.com
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        (Typical response time: 24 hours)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {/* <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "⚡", text: "Quick Response" },
                  { icon: "🎯", text: "Expert Support" },
                  { icon: "🔒", text: "Secure & Private" },
                  { icon: "💬", text: "Friendly Team" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-center hover:shadow-md hover:border-fuchsia-200 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${600 + idx * 100}ms` }}
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <p className="text-sm font-semibold text-gray-900">{feature.text}</p>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Right Side - Contact Form */}
            <div className="animate-slide-in-right">
              <div className="rounded-3xl bg-white shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact us</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Your email address will not be published. Required fields are marked{" "}
                  <span className="text-fuchsia-600">*</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name<span className="text-fuchsia-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name*"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-all duration-300 group-hover:border-gray-300"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email<span className="text-fuchsia-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-all duration-300 group-hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message<span className="text-fuchsia-600">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      rows={6}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-all duration-300 resize-none group-hover:border-gray-300"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 animate-shake">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-scale-in">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Message sent successfully!</p>
                        <p className="text-xs text-emerald-700">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
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
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
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
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}