"use client";
import React from 'react';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';


export default function Footer () {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Social */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src="/logo.png"
                alt="Trupti Warjurkar" 
                className="h-20 w-auto"
              />
            </div>
            <p className="font-semibold text-gray-900 mb-4">Follow Us</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Courses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular courses</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">3C's of Communication</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Speak to Lead</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Talk & Win</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <a href="mailto:info@trupti.com" className="text-gray-600 hover:text-purple-600 transition-colors">
                  trupti.speaks@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <a href="tel:+919370125066" className="text-gray-600 hover:text-purple-600 transition-colors">
                  (+91) 93701 25066
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of use</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            <a href="https://www.metamaster.in">Metamaster</a> Company @ {currentYear}. All rights Reserved.
          </p>
          <a href="mailto:info@metamaster.in" className="text-gray-600 hover:text-purple-600 text-sm transition-colors">
            info@metamaster.in
          </a>
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
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </footer>
  );
};