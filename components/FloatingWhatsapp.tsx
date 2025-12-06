// components/FloatingWhatsApp.tsx
import React from "react";

export default function FloatingWhatsApp() {
  const phoneNumber = "919370125066"; // India format
  const message =
    "Hi Talk&Win Team! 👋\nI'm interested in your courses and would love to know more about how I can improve my communication skills and confidence. Could you please share the details?";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        {/* <span className="absolute inset-0 rounded-full bg-green-500 opacity-70 animate-ping"></span> */}

        {/* Main button with official WhatsApp logo */}
        <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110">
          {/* Official WhatsApp SVG Icon */}
          <img
            src="/whatsapp.svg"
            alt="WhatsApp"
            className="w-8 h-8 md:w-9 md:h-9"
          />
        </div>

        {/* Tooltip on hover (desktop) */}
        {/* <span className="absolute -top-10 -left-8 whitespace-nowrap bg-black text-white text-xs md:text-sm px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span> */}
      </div>
    </a>
  );
}