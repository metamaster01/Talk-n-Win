export default function CTASection (){
  return (
    <section className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 py-16 md:py-20 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-white text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
              Your Journey to Confidence Starts Here.
            </h2>
            <p className="text-purple-100 text-lg mb-2">
              Ready to master the art of communication and express yourself with courage?
            </p>
            <p className="text-purple-100 text-lg">
              Join Trupti Academy and start your transformation today.
            </p>
          </div>
          
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap">
            Explore Courses
          </button>
        </div>
      </div>
    </section>
  );
};