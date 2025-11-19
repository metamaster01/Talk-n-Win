"use client";

// import { url } from "inspector";
import React, { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      text: "Trupti transformed the way our leadership team communicates. Her session was practical, engaging, and full of real-world tools we could use immediately. Our managers are more confident and persuasive than ever.",
      name: "Rohan Sharma",
      role: "Student",
      url: "/testimonial-icon.png",
    },
    {
      text: "The communication techniques I learned have been game-changing for my career. Trupti's approach is incredibly practical and easy to implement. I now speak with confidence in every meeting.",
      name: "Priya Patel",
      role: "Marketing Manager",
      url: "/testimonial-icon.png",
    },
    {
      text: "An exceptional learning experience! The course content was comprehensive and the delivery was outstanding. I've seen remarkable improvement in my public speaking abilities.",
      name: "Amit Kumar",
      role: "Entrepreneur",
      url: "/testimonial-icon.png",
    },
    {
      text: "Trupti's coaching helped me overcome my fear of public speaking. The practical exercises and personalized feedback made all the difference. Highly recommended!",
      name: "Sneha Reddy",
      role: "HR Professional",
      url: "/testimonial-icon.png",
    },
    {
      text: "The best investment I've made in my professional development. The communication skills I gained have opened new doors in my career. Thank you, Trupti!",
      name: "Vikram Singh",
      role: "Sales Executive",
      url: "/testimonial-icon.png",
    },
    {
      text: "From nervous presenter to confident speaker - that's my journey with Trupti Academy. The transformation has been incredible and the results speak for themselves.",
      name: "Anjali Desai",
      role: "Team Leader",
      url: "/testimonial-icon.png",
    },
  ];

  // Triple the testimonials for seamless loop
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 animate-fade-in">
            Testimonials
          </h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Testimonial Cards Carousel */}
        <div className="relative">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentSlide * 100) / 3}%)`,
            }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 h-full border border-gray-100 hover:border-purple-300 transform hover:-translate-y-2">
                  <p className="text-gray-700 text-base leading-relaxed mb-8 min-h-[160px]">
                    {testimonial.text}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-purple-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-200">
                      <img
                        src={testimonial.url}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index + testimonials.length)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide % testimonials.length === index
                  ? "w-8 bg-purple-600"
                  : "w-3 bg-gray-300 hover:bg-purple-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
