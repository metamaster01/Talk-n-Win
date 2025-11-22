

import CommunicatorSection from "@/components/communicator-section";
import ConfidenceSection from "@/components/confidence-section";
import CTASection from "@/components/cta-section";
import DemoClassShowcase from "@/components/DemoClass";
import FeaturedCourses from "@/components/FeaturedCourse";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import LearningCards from "@/components/learning-cards";
import Navigation from "@/components/navigation";
import ProgramTargetSection from "@/components/program-target-section";
import RecentActivity from "@/components/RecentActivity";
import StatsSection from "@/components/stats-section";
import TestimonialsSection from "@/components/testimonial-section";
import { fetchPublicCourses } from "@/lib/supabase-course";


export default async function page() {

const courses = await fetchPublicCourses(9);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* <Navigation /> */}
      <HeroSection />
      <StatsSection />
      <RecentActivity />
      <FeaturedCourses courses={courses}/>
      <DemoClassShowcase />
      <ConfidenceSection />
      <LearningCards />
      <CommunicatorSection />
      <ProgramTargetSection />
      <TestimonialsSection />
      <CTASection />
      {/* <Footer /> */}
    </div>
  )
}


