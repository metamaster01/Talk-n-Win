// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Search, Bell, Heart, ShoppingCart } from "lucide-react"
// import { motion } from "framer-motion"

// export default function Navigation() {
//   const [isScrolled, setIsScrolled] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const navItems = ["Home", "Courses", "Students", "Contact"]
//   const iconVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: (i: number) => ({
//       opacity: 1,
//       scale: 1,
//       transition: { delay: i * 0.1, duration: 0.3 },
//     }),
//   }

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className={`fixed w-full top-0 z-50 transition-all duration-300 ${
//         isScrolled ? "bg-white shadow-lg" : "bg-white"
//       }`}
//     >
//       {/* Top Navigation Bar */}
//       <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 py-2">
//         <div className="flex items-center justify-between mb-2">
//           {/* Logo */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex-shrink-0"
//           >
//             <img src="/logo.png" alt="Trupti Warjurkar" className="h-12 w-auto" />
//           </motion.div>

//           {/* Center Navigation Menu */}
//           <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
//             {navItems.map((item, index) => (
//               <motion.div
//                 key={item}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.4 }}
//               >
//                 <Link
//                   href={`/${item.toLowerCase()}`}
//                   className="text-gray-800 font-medium text-sm hover:text-purple-600 transition-colors duration-200 relative group"
//                 >
//                   {item}
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
//                 </Link>
//               </motion.div>
//             ))}
//           </div>

//           {/* Explore Course Button */}
//           <motion.button
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.98 }}
//             className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-300"
//           >
//             Explore Course
//           </motion.button>
//         </div>

//         {/* Bottom Navigation Bar */}
//         <div className="flex items-center justify-between gap-4">
//           {/* Search Bar */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.4 }}
//             className="flex-1 max-w-xs"
//           >
//             <div className="relative hidden sm:block">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="What do you want learn..."
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
//               />
//             </div>
//           </motion.div>

//           {/* Icons and Buttons */}
//           <div className="flex items-center gap-4 md:gap-6">
//             {/* Icon Group */}
//             <motion.div className="flex items-center gap-4">
//               {[
//                 { Icon: Bell, label: "Notifications" },
//                 { Icon: Heart, label: "Wishlist" },
//                 { Icon: ShoppingCart, label: "Cart" },
//               ].map(({ Icon, label }, i) => (
//                 <motion.button
//                   key={label}
//                   custom={i}
//                   variants={iconVariants}
//                   initial="hidden"
//                   animate="visible"
//                   whileHover={{ scale: 1.15, color: "#a855f7" }}
//                   whileTap={{ scale: 0.95 }}
//                   className="text-gray-600 hover:text-purple-600 transition-colors duration-200 relative"
//                   aria-label={label}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
//                 </motion.button>
//               ))}
//             </motion.div>

//             {/* Auth Buttons */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4, duration: 0.4 }}
//               className="flex items-center gap-2"
//             >
//               <button className="px-4 py-2 text-purple-600 font-medium text-sm border border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
//                 Create Account
//               </button>
//               <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-200">
//                 Sign In
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.nav>
//   )
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  HomeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type PublicCourseMini = {
  id: string;
  title: string;
  slug: string;
  category_name: string | null;
};

export default function Navigation() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [popular, setPopular] = useState<PublicCourseMini[]>([]);
  const [results, setResults] = useState<PublicCourseMini[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth init + listener
  useEffect(() => {
    const supabase = supabaseServer();

    const loadUser = async () => {
      setAuthLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", data.user.id)
          .single();
        setProfile(prof || null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    };

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setProfile(null);
      } else {
        loadUser();
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Search overlay: fetch popular courses when first opened
  useEffect(() => {
    if (!isSearchOpen || popular.length > 0) return;
    const supabase = supabaseServer();
    (async () => {
      const { data } = await supabase
        .from("public_courses")
        .select("id, title, slug, category_name")
        .order("students_count", { ascending: false })
        .limit(6);
      setPopular((data as any) || []);
    })();
  }, [isSearchOpen, popular.length]);

  // Search query effect (debounced)
  useEffect(() => {
    if (!isSearchOpen) return;
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const supabase = supabaseServer();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      const { data } = await supabase
        .from("public_courses")
        .select("id, title, slug, category_name")
        .or(
          `title.ilike.%${q}%,category_name.ilike.%${q}%`
        )
        .limit(10);
      setResults((data as any) || []);
      setSearchLoading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, isSearchOpen]);

  // Close search overlay with ESC
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setResults([]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSearchOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Contact", href: "/contact" },
  ];

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const handleLogout = async () => {
    const supabase = supabaseServer();
    await supabase.auth.signOut();
    router.push("/");
  };

  const firstName =
    profile?.full_name?.split(" ")?.[0] ||
    user?.email?.split("@")?.[0] ||
    "Learner";

  const avatarInitial =
    profile?.full_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
    setResults([]);
  };

  const goToCourse = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setResults([]);
    router.push(`/courses/${slug}`);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 py-2">
          {/* Top row */}
          <div className="flex items-center justify-between mb-2">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Trupti Warjurkar"
                  className="h-12 w-auto"
                />
              </Link>
            </motion.div>

            {/* Center nav (desktop) */}
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-800 font-medium text-sm hover:text-purple-600 transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Explore button (desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <Link
                href="/courses"
                className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-300"
              >
                Explore Courses
              </Link>
            </motion.div>

            {/* Right side (mobile) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={openSearch}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom row (desktop only) */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex-1 max-w-xs"
            >
              <button
                onClick={openSearch}
                className="w-full flex items-center gap-2 pl-3 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-white hover:border-fuchsia-500 transition-all duration-200"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-left flex-1">
                  What do you want to learn...
                </span>
              </button>
            </motion.div>

            {/* Icons + Auth / User */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Icons */}
              <motion.div className="flex items-center gap-4">
                {[
                  { Icon: Bell, label: "Notifications" },
                  { Icon: Heart, label: "Wishlist", src: "/wishlist" },
                  { Icon: ShoppingCart, label: "Cart", src: "/cart" },
                ].map(({ Icon, label, src }, i) => (
                  <motion.button
                    key={label}
                    custom={i}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.15, color: "#a855f7" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 relative"
                    aria-label={label}
                    onClick={() => {
                      if (src) router.push(src);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
                  </motion.button>
                ))}
              </motion.div>

              {/* Auth / User section */}
              {!authLoading && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block text-xs text-gray-600">
                    <div className="font-semibold text-gray-800">
                      Welcome, {firstName}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Ready to keep learning?
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="hidden sm:inline-flex px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded-lg text-xs font-medium hover:bg-fuchsia-100 transition"
                  >
                    My Dashboard
                  </Link>

                  {/* Avatar / user menu (simple version) */}
                  <div className="relative group">
                    <button
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-semibold overflow-hidden"
                      aria-label="Account"
                    >
                      {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt={firstName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        avatarInitial
                      )}
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-100 text-xs text-gray-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="font-semibold text-gray-900">
                          {firstName}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
                      >
                        <HomeIcon className="w-3 h-3" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => router.push("/account")}
                        className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
                      >
                        <User className="w-3 h-3" />
                        <span>Account</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Not logged in
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <Link
                    href="/login?mode=signup"
                    className="px-4 py-2 text-fuchsia-600 font-medium text-sm border border-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-all duration-200"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/login?mode=login"
                    className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-200"
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 pt-3 pb-4 space-y-3">
                {/* Search bar for mobile */}
                <button
                  onClick={openSearch}
                  className="w-full flex items-center gap-2 pl-3 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-white hover:border-fuchsia-500 transition-all duration-200"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-left">
                    Search courses…
                  </span>
                </button>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-gray-800 font-medium hover:text-purple-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {!authLoading && user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        router.push("/dashboard");
                      }}
                      className="w-full mt-2 px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded-lg text-xs font-medium hover:bg-fuchsia-100 transition"
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        await handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 mt-1 text-xs text-red-600 border border-red-100 rounded-lg hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <Link
                      href="/login?mode=signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-4 py-2 text-fuchsia-600 font-medium text-xs border border-fuchsia-500 rounded-lg text-center hover:bg-fuchsia-50"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/login?mode=login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-xs text-center hover:shadow-lg"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40"
          >
            <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white shadow-xl px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course name or category…"
                  className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setResults([]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Popular courses
                  </div>
                  {popular.length === 0 && (
                    <div className="text-xs text-gray-400">
                      Loading popular courses…
                    </div>
                  )}
                  <ul className="space-y-1">
                    {popular.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => goToCourse(c.slug)}
                          className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-fuchsia-50"
                        >
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {c.title}
                          </div>
                          {c.category_name && (
                            <div className="text-[11px] text-gray-500">
                              {c.category_name}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {searchQuery.trim()
                        ? "Search results"
                        : "Start typing to search"}
                    </span>
                    {searchLoading && (
                      <span className="text-[10px] text-gray-400">
                        Searching…
                      </span>
                    )}
                  </div>
                  {searchQuery.trim() && results.length === 0 && !searchLoading && (
                    <div className="text-xs text-gray-400">
                      No courses match “{searchQuery}”.
                    </div>
                  )}
                  <ul className="space-y-1">
                    {results.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => goToCourse(c.slug)}
                          className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-purple-50"
                        >
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {c.title}
                          </div>
                          {c.category_name && (
                            <div className="text-[11px] text-gray-500">
                              {c.category_name}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-gray-400">
                Tip: press <span className="rounded bg-gray-100 px-1">Esc</span>{" "}
                to close.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   Search,
//   Bell,
//   Heart,
//   ShoppingCart,
//   Menu,
//   X,
//   LogOut,
//   User,
//   HomeIcon,
//   ChevronRight,
//   Settings,
//   BookOpen,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// // import { createClient } from "@supabase/supabase-js";
// // import { supabaseServer } from "@/lib/supabas";
// import { supabaseServer } from "@/lib/supabase-course";

// // function supabaseServer() {
// //   return createClient(
// //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// //   );
// // }

// type PublicCourseMini = {
//   id: string;
//   title: string;
//   slug: string;
//   category_name: string | null;
// };

// export default function Navigation() {
//   const router = useRouter();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileUserDrawer, setMobileUserDrawer] = useState(false);

//   // Auth state
//   const [user, setUser] = useState<any | null>(null);
//   const [profile, setProfile] = useState<any | null>(null);
//   const [authLoading, setAuthLoading] = useState(true);
  
//   // Counts
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [cartCount, setCartCount] = useState(0);

//   // Search state
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [popular, setPopular] = useState<PublicCourseMini[]>([]);
//   const [results, setResults] = useState<PublicCourseMini[]>([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Auth init + listener
//   useEffect(() => {
//     const supabase = supabaseServer();

//     const loadUser = async () => {
//       setAuthLoading(true);
//       const { data } = await supabase.auth.getUser();
//       if (data.user) {
//         setUser(data.user);
//         const { data: prof } = await supabase
//           .from("profiles")
//           .select("full_name, avatar_url")
//           .eq("id", data.user.id)
//           .single();
//         setProfile(prof || null);
        
//         // Load counts
//         loadCounts(data.user.id);
//       } else {
//         setUser(null);
//         setProfile(null);
//         setWishlistCount(0);
//         setCartCount(0);
//       }
//       setAuthLoading(false);
//     };

//     loadUser();

//     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) {
//         setUser(null);
//         setProfile(null);
//         setWishlistCount(0);
//         setCartCount(0);
//       } else {
//         loadUser();
//       }
//     });

//     return () => {
//       sub.subscription.unsubscribe();
//     };
//   }, []);

//   // Load wishlist and cart counts
//   const loadCounts = async (userId: string) => {
//     const supabase = supabaseServer();
    
//     // Wishlist count
//     const { count: wishCount } = await supabase
//       .from("wishlist_items")
//       .select("*", { count: "exact", head: true })
//       .eq("user_id", userId);
    
//     setWishlistCount(wishCount || 0);
    
//     // Cart count
//     const { count: cartCount } = await supabase
//       .from("cart_items")
//       .select("*", { count: "exact", head: true })
//       .eq("user_id", userId);
    
//     setCartCount(cartCount || 0);
//   };

//   // Search overlay: fetch popular courses when first opened
//   useEffect(() => {
//     if (!isSearchOpen || popular.length > 0) return;
//     const supabase = supabaseServer();
//     (async () => {
//       const { data } = await supabase
//         .from("public_courses")
//         .select("id, title, slug, category_name")
//         .order("students_count", { ascending: false })
//         .limit(6);
//       setPopular((data as any) || []);
//     })();
//   }, [isSearchOpen, popular.length]);

//   // Search query effect (debounced)
//   useEffect(() => {
//     if (!isSearchOpen) return;
//     const q = searchQuery.trim();
//     if (!q) {
//       setResults([]);
//       return;
//     }

//     const supabase = supabaseServer();
//     const timeout = setTimeout(async () => {
//       setSearchLoading(true);
//       const { data } = await supabase
//         .from("public_courses")
//         .select("id, title, slug, category_name")
//         .or(`title.ilike.%${q}%,category_name.ilike.%${q}%`)
//         .limit(10);
//       setResults((data as any) || []);
//       setSearchLoading(false);
//     }, 250);

//     return () => clearTimeout(timeout);
//   }, [searchQuery, isSearchOpen]);

//   // Close search overlay with ESC
//   useEffect(() => {
//     if (!isSearchOpen) return;
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setIsSearchOpen(false);
//         setSearchQuery("");
//         setResults([]);
//       }
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [isSearchOpen]);

//   // Prevent body scroll when drawer is open
//   useEffect(() => {
//     if (mobileUserDrawer) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileUserDrawer]);

//   const navItems = [
//     { label: "Home", href: "/" },
//     { label: "Courses", href: "/courses" },
//     { label: "Contact", href: "/contact" },
//   ];

//   const iconVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: (i: number) => ({
//       opacity: 1,
//       scale: 1,
//       transition: { delay: i * 0.1, duration: 0.3 },
//     }),
//   };

//   const handleLogout = async () => {
//     const supabase = supabaseServer();
//     await supabase.auth.signOut();
//     router.push("/");
//   };

//   const firstName =
//     profile?.full_name?.split(" ")?.[0] ||
//     user?.email?.split("@")?.[0] ||
//     "Learner";

//   const avatarInitial =
//     profile?.full_name?.[0]?.toUpperCase() ||
//     user?.email?.[0]?.toUpperCase() ||
//     "U";

//   const openSearch = () => {
//     setIsSearchOpen(true);
//     setSearchQuery("");
//     setResults([]);
//   };

//   const goToCourse = (slug: string) => {
//     setIsSearchOpen(false);
//     setSearchQuery("");
//     setResults([]);
//     router.push(`/courses/${slug}`);
//   };

//   const getAvatarUrl = (avatarPath: string | null) => {
//     if (!avatarPath) return null;
//     const supabase = supabaseServer();
//     const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
//     return data.publicUrl;
//   };

//   const avatarUrl = getAvatarUrl(profile?.avatar_url);

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className={`fixed w-full top-0 z-50 transition-all duration-300 ${
//           isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 py-2">
//           {/* Top row */}
//           <div className="flex items-center justify-between mb-2">
//             {/* Logo - clickable on mobile */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="flex-shrink-0"
//             >
//               <Link href="/" className="hidden md:flex items-center gap-2">
//                 <img
//                   src="/logo.png"
//                   alt="Trupti Warjurkar"
//                   className="h-12 w-auto"
//                 />
//               </Link>
              
//               {/* Mobile logo - opens user drawer */}
//               <button
//                 onClick={() => setMobileUserDrawer(true)}
//                 className="md:hidden flex items-center gap-2"
//               >
//                 <img
//                   src="/logo.png"
//                   alt="Trupti Warjurkar"
//                   className="h-12 w-auto"
//                 />
//               </button>
//             </motion.div>

//             {/* Center nav (desktop) */}
//             <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
//               {navItems.map((item, index) => (
//                 <motion.div
//                   key={item.href}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1, duration: 0.4 }}
//                 >
//                   <Link
//                     href={item.href}
//                     className="text-gray-800 font-medium text-sm hover:text-purple-600 transition-colors duration-200 relative group"
//                   >
//                     {item.label}
//                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Explore button (desktop) */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="hidden md:block"
//             >
//               <Link
//                 href="/courses"
//                 className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-300"
//               >
//                 Explore Courses
//               </Link>
//             </motion.div>

//             {/* Right side (mobile) */}
//             <div className="flex items-center gap-2 md:hidden">
//               <button
//                 onClick={openSearch}
//                 className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
//                 aria-label="Search"
//               >
//                 <Search className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setMobileOpen((v) => !v)}
//                 className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
//                 aria-label="Menu"
//               >
//                 {mobileOpen ? (
//                   <X className="w-6 h-6" />
//                 ) : (
//                   <Menu className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Bottom row (desktop only) */}
//           <div className="hidden md:flex items-center justify-between gap-4">
//             {/* Search bar */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.4 }}
//               className="flex-1 max-w-xs"
//             >
//               <button
//                 onClick={openSearch}
//                 className="w-full flex items-center gap-2 pl-3 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-white hover:border-fuchsia-500 transition-all duration-200"
//               >
//                 <Search className="w-4 h-4 text-gray-400" />
//                 <span className="text-left flex-1">
//                   What do you want to learn...
//                 </span>
//               </button>
//             </motion.div>

//             {/* Icons + Auth / User */}
//             <div className="flex items-center gap-4 md:gap-6">
//               {/* Icons */}
//               <motion.div className="flex items-center gap-4">
//                 {[
//                   { Icon: Bell, label: "Notifications" },
//                   { Icon: Heart, label: "Wishlist", src: "/wishlist" },
//                   { Icon: ShoppingCart, label: "Cart", src: "/cart" },
//                 ].map(({ Icon, label, src }, i) => (
//                   <motion.button
//                     key={label}
//                     custom={i}
//                     variants={iconVariants}
//                     initial="hidden"
//                     animate="visible"
//                     whileHover={{ scale: 1.15, color: "#a855f7" }}
//                     whileTap={{ scale: 0.95 }}
//                     className="text-gray-600 hover:text-purple-600 transition-colors duration-200 relative"
//                     aria-label={label}
//                     onClick={() => {
//                       if (src) router.push(src);
//                     }}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
//                   </motion.button>
//                 ))}
//               </motion.div>

//               {/* Auth / User section */}
//               {!authLoading && user ? (
//                 <div className="flex items-center gap-3">
//                   <div className="hidden lg:block text-xs text-gray-600">
//                     <div className="font-semibold text-gray-800">
//                       Welcome, {firstName}
//                     </div>
//                     <div className="text-[11px] text-gray-400">
//                       Ready to keep learning?
//                     </div>
//                   </div>
//                   <Link
//                     href="/dashboard"
//                     className="hidden sm:inline-flex px-4 py-2 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded-lg text-xs font-medium hover:bg-fuchsia-100 transition"
//                   >
//                     My Dashboard
//                   </Link>

//                   {/* Avatar / user menu (simple version) */}
//                   <div className="relative group">
//                     <button
//                       className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-semibold overflow-hidden"
//                       aria-label="Account"
//                     >
//                       {avatarUrl ? (
//                         <img
//                           src={avatarUrl}
//                           alt={firstName}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         avatarInitial
//                       )}
//                     </button>

//                     {/* Dropdown */}
//                     <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-100 text-xs text-gray-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
//                       <div className="px-3 py-2 border-b border-gray-100">
//                         <div className="font-semibold text-gray-900">
//                           {firstName}
//                         </div>
//                         <div className="text-[11px] text-gray-400">
//                           {user.email}
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => router.push("/dashboard")}
//                         className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
//                       >
//                         <HomeIcon className="w-3 h-3" />
//                         <span>Dashboard</span>
//                       </button>
//                       <button
//                         onClick={() => router.push("/account")}
//                         className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
//                       >
//                         <User className="w-3 h-3" />
//                         <span>Account</span>
//                       </button>
//                       <button
//                         onClick={handleLogout}
//                         className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
//                       >
//                         <LogOut className="w-3 h-3" />
//                         <span>Logout</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // Not logged in
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4, duration: 0.4 }}
//                   className="flex items-center gap-2"
//                 >
//                   <Link
//                     href="/login?mode=signup"
//                     className="px-4 py-2 text-fuchsia-600 font-medium text-sm border border-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-all duration-200"
//                   >
//                     Create Account
//                   </Link>
//                   <Link
//                     href="/login?mode=login"
//                     className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-200"
//                   >
//                     Sign In
//                   </Link>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile slide-down menu (navigation links only) */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="md:hidden border-t border-gray-100 bg-white"
//             >
//               <div className="px-4 pt-3 pb-4 space-y-3">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className="block text-sm text-gray-800 font-medium hover:text-purple-600 py-2"
//                     onClick={() => setMobileOpen(false)}
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//                 <Link
//                   href="/courses"
//                   className="block w-full px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg font-medium text-sm text-center hover:shadow-lg transition-shadow mt-4"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   Explore Courses
//                 </Link>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       {/* MOBILE USER DRAWER (slides from left) */}
//       <AnimatePresence>
//         {mobileUserDrawer && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileUserDrawer(false)}
//               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
//             />

//             {/* Drawer */}
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed left-0 top-0 bottom-0 w-[75vw] max-w-sm bg-white shadow-2xl z-[70] md:hidden overflow-y-auto"
//             >
//               {/* Header with logo */}
//               <div className="sticky top-0 bg-gradient-to-br from-purple-200 to-purple-700 p-6 pb-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <img
//                     src="/logo.png"
//                     alt="Talk and Win"
//                     className="h-16 w-auto brightness-0 invert"
//                   />
//                   <button
//                     onClick={() => setMobileUserDrawer(false)}
//                     className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* User info */}
//                 {!authLoading && user ? (
//                   <div className="flex items-center gap-4">
//                     <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-white/30">
//                       {avatarUrl ? (
//                         <img
//                           src={avatarUrl}
//                           alt={firstName}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         avatarInitial
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-white font-bold text-lg truncate">
//                         {profile?.full_name || firstName}
//                       </h3>
//                       <p className="text-white/80 text-xs truncate">
//                         {user.email}
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <h3 className="text-white font-bold text-lg mb-2">
//                       Welcome to Talk and Win
//                     </h3>
//                     <p className="text-white/80 text-sm">
//                       Sign in to access your courses
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Menu items */}
//               <div className="p-4">
//                 {!authLoading && user ? (
//                   <>
//                     {/* Main actions */}
//                     <div className="space-y-1 mb-6">
//                       <button
//                         onClick={() => {
//                           router.push("/");
//                           setMobileUserDrawer(false);
//                         }}
//                         className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
//                             <HomeIcon className="w-5 h-5" />
//                           </div>
//                           <span className="font-semibold text-gray-800">
//                             Home
//                           </span>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
//                       </button>

//                       <button
//                         onClick={() => {
//                           router.push("/courses");
//                           setMobileUserDrawer(false);
//                         }}
//                         className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
//                             <BookOpen className="w-5 h-5" />
//                           </div>
//                           <span className="font-semibold text-gray-800">
//                             Browse Courses
//                           </span>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
//                       </button>

//                       <button
//                         onClick={() => {
//                           router.push("/dashboard");
//                           setMobileUserDrawer(false);
//                         }}
//                         className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-fuchsia-50 transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-fuchsia-100 text-fuchsia-600 group-hover:bg-fuchsia-200 transition-colors">
//                             <HomeIcon className="w-5 h-5" />
//                           </div>
//                           <span className="font-semibold text-gray-800">
//                             My Dashboard
//                           </span>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-fuchsia-600 transition-colors" />
//                       </button>

//                       <button
//                         onClick={() => {
//                           router.push("/account");
//                           setMobileUserDrawer(false);
//                         }}
//                         className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
//                             <User className="w-5 h-5" />
//                           </div>
//                           <span className="font-semibold text-gray-800">
//                             Account Settings
//                           </span>
//                         </div>
//                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
//                       </button>
//                     </div>

//                     {/* Quick access */}
//                     <div className="mb-6">
//                       <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
//                         Quick Access
//                       </h4>
//                       <div className="grid grid-cols-3 gap-3">
//                         <button
//                           onClick={() => {
//                             router.push("/wishlist");
//                             setMobileUserDrawer(false);
//                           }}
//                           className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50 hover:shadow-md transition-all"
//                         >
//                           <div className="p-2 rounded-lg bg-white">
//                             <Heart className="w-5 h-5 text-pink-600" />
//                           </div>
//                           <span className="text-xs font-semibold text-gray-700">
//                             Wishlist
//                           </span>
//                           {wishlistCount > 0 && (
//                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-semibold">
//                               {wishlistCount}
//                             </span>
//                           )}
//                         </button>

//                         <button
//                           onClick={() => {
//                             router.push("/cart");
//                             setMobileUserDrawer(false);
//                           }}
//                           className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 hover:shadow-md transition-all"
//                         >
//                           <div className="p-2 rounded-lg bg-white">
//                             <ShoppingCart className="w-5 h-5 text-purple-600" />
//                           </div>
//                           <span className="text-xs font-semibold text-gray-700">
//                             Cart
//                           </span>
//                           {cartCount > 0 && (
//                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold">
//                               {cartCount}
//                             </span>
//                           )}
//                         </button>

//                         <button
//                           onClick={() => {
//                             setMobileUserDrawer(false);
//                           }}
//                           className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all"
//                         >
//                           <div className="p-2 rounded-lg bg-white">
//                             <Bell className="w-5 h-5 text-blue-600" />
//                           </div>
//                           <span className="text-xs font-semibold text-gray-700">
//                             Alerts
//                           </span>
//                         </button>
//                       </div>
//                     </div>

//                     {/* Logout */}
//                     <button
//                       onClick={async () => {
//                         await handleLogout();
//                         setMobileUserDrawer(false);
//                       }}
//                       className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
//                     >
//                       <LogOut className="w-5 h-5" />
//                       <span>Logout</span>
//                     </button>
//                   </>
//                 ) : (
//                   // Not logged in
//                   <div className="space-y-3">
//                     <Link
//                       href="/login?mode=login"
//                       onClick={() => setMobileUserDrawer(false)}
//                       className="block w-full px-6 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-semibold text-center hover:shadow-lg transition-shadow"
//                     >
//                       Sign In
//                     </Link>
//                     <Link
//                       href="/login?mode=signup"
//                       onClick={() => setMobileUserDrawer(false)}
//                       className="block w-full px-6 py-4 border-2 border-fuchsia-500 text-fuchsia-600 rounded-2xl font-semibold text-center hover:bg-fuchsia-50 transition-colors"
//                     >
//                       Create Account
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               <div className="p-6 border-t border-gray-100 text-center">
//                 <p className="text-xs text-gray-500">
//                   © 2025 Talk And Win <br /> <span> Developed by <Link href={"https://www.metamster.in"}>Metamaster</Link> </span> . All rights reserved.
//                 </p>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* SEARCH OVERLAY */}
//       <AnimatePresence>
//         {isSearchOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="fixed inset-x-0 top-16 z-40 px-4"
//           >
//             <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white shadow-xl px-4 py-4 sm:px-6">
//               <div className="flex items-center gap-3">
//                 <Search className="w-5 h-5 text-gray-400" />
//                 <input
//                   autoFocus
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search by course name or category…"
//                   className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400"
//                 />
//                 <button
//                   onClick={() => {
//                     setIsSearchOpen(false);
//                     setSearchQuery("");
//                     setResults([]);
//                   }}
//                   className="text-xs text-gray-500 hover:text-gray-800"
//                 >
//                   Close
//                 </button>
//               </div>

//               <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
//                     Popular courses
//                   </div>
//                   {popular.length === 0 && (
//                     <div className="text-xs text-gray-400">
//                       Loading popular courses…
//                     </div>
//                   )}
//                   <ul className="space-y-1">
//                     {popular.map((c) => (
//                       <li key={c.id}>
//                         <button
//                           onClick={() => goToCourse(c.slug)}
//                           className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-fuchsia-50"
//                         >
//                           <div className="font-medium text-gray-900 line-clamp-1">
//                             {c.title}
//                           </div>
//                           {c.category_name && (
//                             <div className="text-[11px] text-gray-500">
//                               {c.category_name}
//                             </div>
//                           )}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <div className="mb-1 flex items-center justify-between">
//                     <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
//                       {searchQuery.trim()
//                         ? "Search results"
//                         : "Start typing to search"}
//                     </span>
//                     {searchLoading && (
//                       <span className="text-[10px] text-gray-400">
//                         Searching…
//                       </span>
//                     )}
//                   </div>
//                   {searchQuery.trim() && results.length === 0 && !searchLoading && (
//                     <div className="text-xs text-gray-400">
//                       No courses match "{searchQuery}".
//                     </div>
//                   )}
//                   <ul className="space-y-1">
//                     {results.map((c) => (
//                       <li key={c.id}>
//                         <button
//                           onClick={() => goToCourse(c.slug)}
//                           className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-purple-50"
//                         >
//                           <div className="font-medium text-gray-900 line-clamp-1">
//                             {c.title}
//                           </div>
//                           {c.category_name && (
//                             <div className="text-[11px] text-gray-500">
//                               {c.category_name}
//                             </div>
//                           )}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <div className="mt-2 text-[10px] text-gray-400">
//                 Tip: press <span className="rounded bg-gray-100 px-1">Esc</span>{" "}
//                 to close.
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }