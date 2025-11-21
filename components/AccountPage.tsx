"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  User,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Star,
  Edit2,
  Save,
  X,
  Loader2,
  Award,
  Clock,
  ShoppingBag,
  MessageSquare,
  Camera,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { publicImageURL } from "@/lib/supabase-course";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Helper function to get public image URL from Supabase storage
const getPublicImageUrl = (path: string | null, bucket: string = "public_thumbnails") => {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  country: string | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  thumbnail_url: string | null;
  language: string;
  level: string;
  duration_minutes: number;
  students_count: number;
  certificate_provided: boolean;
}

interface Review {
  id: string;
  course_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  display_name: string | null;
  course?: {
    title: string;
    thumbnail_url: string | null;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "courses" | "reviews">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<Profile>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      setUser(authUser);

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setEditProfile(profileData);
      }

      // Load courses
      const { data: coursesData } = await supabase
        .from("my_courses")
        .select("*")
        .eq("user_id", authUser.id);

      setCourses(coursesData || []);

      // Load reviews with course info
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          *,
          course:courses(title,thumbnail_url)
        `)
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editProfile.full_name,
          phone: editProfile.phone,
          country: editProfile.country,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({ ...profile, ...editProfile } as Profile);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "My Courses", icon: BookOpen, count: courses.length },
    { id: "reviews", label: "My Reviews", icon: Star, count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 relative overflow-hidden mt-14">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              My Account
            </h1>
            <p className="text-gray-600">Manage your profile, courses, and reviews</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 animate-slide-up animation-delay-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/20" : "bg-fuchsia-100 text-fuchsia-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            {activeTab === "profile" && (
              <ProfileSection
                profile={profile}
                editProfile={editProfile}
                setEditProfile={setEditProfile}
                editing={editing}
                setEditing={setEditing}
                saving={saving}
                handleSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === "courses" && (
              <CoursesSection courses={courses} router={router} />
            )}

            {activeTab === "reviews" && (
              <ReviewsSection reviews={reviews} />
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
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function ProfileSection({
  profile,
  editProfile,
  setEditProfile,
  editing,
  setEditing,
  saving,
  handleSaveProfile,
}: any) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Avatar Card */}
      <div className="lg:col-span-1">
        <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
              <Camera className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile?.full_name || "User"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{profile?.email}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-600 text-xs font-semibold">
            <Award className="h-4 w-4" />
            {profile?.role?.toUpperCase() || "STUDENT"}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Joined {new Date(profile?.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="lg:col-span-2">
        <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditProfile(profile);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="h-4 w-4 text-fuchsia-600" />
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editProfile.full_name || ""}
                  onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-900">{profile?.full_name || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="h-4 w-4 text-fuchsia-600" />
                Email
              </label>
              <p className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-500">{profile?.email}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="h-4 w-4 text-fuchsia-600" />
                Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={editProfile.phone || ""}
                  onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-900">{profile?.phone || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Globe className="h-4 w-4 text-fuchsia-600" />
                Country
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editProfile.country || ""}
                  onChange={(e) => setEditProfile({ ...editProfile, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-2xl bg-gray-50 text-gray-900">{profile?.country || "Not set"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesSection({ courses, router }: any) {
  if (courses.length === 0) {
    return (
      <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-fuchsia-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
        <p className="text-gray-600 mb-6">Start your learning journey by browsing our courses</p>
        <button
          onClick={() => router.push("/courses")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
        >
          <BookOpen className="h-5 w-5" />
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: Course, idx: number) => (
        <div
          key={course.id}
          className="group rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
          onClick={() => router.push(`/dashboard/course/${course.slug}`)}
        >
          <div className="relative aspect-video bg-gradient-to-br from-fuchsia-400 to-purple-600">
            {course.thumbnail_url ? (
              <img src={publicImageURL(course.thumbnail_url) || ""} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-12 w-12 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            {course.certificate_provided && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1 text-xs font-semibold text-fuchsia-600">
                <Award className="h-3 w-3" />
                Certificate
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-fuchsia-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.short_description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
              </span>
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-600 font-semibold">
                {course.level}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">{course.students_count}+ students</span>
              <span className="text-xs font-semibold text-fuchsia-600">Continue Learning →</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsSection({ reviews }: any) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 flex items-center justify-center">
          <MessageSquare className="h-10 w-10 text-fuchsia-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Share your experience by reviewing your courses</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review: Review, idx: number) => (
        <div
          key={review.id}
          className="rounded-3xl bg-white shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            {review.course?.thumbnail_url && (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-600 flex-shrink-0 overflow-hidden">
                <img src={publicImageURL(review.course.thumbnail_url) || ""} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{review.title || "Course Review"}</h4>
                  <p className="text-sm text-gray-500">{review.course?.title}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mb-3">{review.comment}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}