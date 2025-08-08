"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Clock,
  Award,
  Video,
  FileText,
  Building2,
  Smartphone,
  Car,
  ShoppingBag,
  Globe,
  CreditCard,
  Plane,
  Zap,
  Music,
  Coffee,
} from "lucide-react";
import Image from "next/image";

export function LandingPage() {
  const router = useRouter();

  const trustedCompanies = [
    { name: "BBC", icon: Globe },
    { name: "Sky", icon: Plane },
    { name: "Tesco", icon: ShoppingBag },
    { name: "Vodafone", icon: Smartphone },
    { name: "Barclays", icon: CreditCard },
    { name: "Rolls-Royce", icon: Car },
    { name: "BT Group", icon: Zap },
    { name: "Sainsbury's", icon: Coffee },
    { name: "HSBC", icon: Building2 },
    { name: "Spotify", icon: Music },
    { name: "Virgin", icon: Plane },
    { name: "Unilever", icon: ShoppingBag },
    { name: "Shell", icon: Zap },
    { name: "British Airways", icon: Plane },
    { name: "Marks & Spencer", icon: ShoppingBag },
    { name: "John Lewis", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="https://titanscareers.com/assets/logo-DMzVeG9H.png"
                alt="Titans Career"
                width={100}
                height={50}
                className="rounded-lg"
              />
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <a
                href="#features"
                className="hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="hover:text-slate-900 transition-colors"
              >
                About
              </a>
              <a
                href="#resources"
                className="hover:text-slate-900 transition-colors"
              >
                Resources
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="text-slate-600 hover:text-slate-900"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/sign-up")}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-primary/80 px-3 py-1 rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Empowering Facilitators</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Super minimal
                <br />
                way to start your
                <br />
                <span className="text-primary">online courses!</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                A comprehensive platform for facilitators to create courses,
                manage students, schedule live classes, and track progress—all
                in one place.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => router.push("/sign-up")}
                className="bg-primary hover:bg-primary/80 text-white px-8 py-4 text-base font-semibold"
              >
                Sign up
              </Button>

              <button
                onClick={() => router.push("/login")}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center space-x-2 mt-3"
              >
                <span>Sign in </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-sm text-slate-500 flex items-center mt-4">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                No credit card required
              </p>
            </div>
          </div>

          {/* Right Demo */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Browser Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-slate-500 border">
                    facilitator.titanscareers.com
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Dashboard
                    </h3>
                    <p className="text-sm text-slate-500">
                      Welcome back, Sarah!
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live class active</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <div className="text-2xl font-bold text-slate-900">156</div>
                    <div className="text-sm text-slate-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Active Students
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <div className="text-2xl font-bold text-slate-900">8</div>
                    <div className="text-sm text-slate-600 flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Live Courses
                    </div>
                  </div>
                </div>

                {/* Course List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          Web Development Bootcamp
                        </div>
                        <div className="text-sm text-slate-500">
                          24 students • 89% completion
                        </div>
                      </div>
                    </div>
                    <PlayCircle className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          Data Science Fundamentals
                        </div>
                        <div className="text-sm text-slate-500">
                          18 students • 76% completion
                        </div>
                      </div>
                    </div>
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>

                {/* Upcoming Class */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-blue-900">
                          Next Live Class
                        </div>
                        <div className="text-sm text-primary/80 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Today at 2:00 PM
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/80 text-white"
                    >
                      Join Class
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Feature Cards */}
            <div className="absolute -top-4 -right-4 bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium">Assignment created</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium">3 new students enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-slate-200 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Trusted by leading UK companies
            </p>

            {/* Moving Carousel */}
            <div className="relative">
              <div className="flex animate-scroll">
                {/* First set of companies */}
                {trustedCompanies.map((company, index) => {
                  const IconComponent = company.icon;
                  return (
                    <div
                      key={`first-${index}`}
                      className="flex items-center space-x-3 mx-6 lg:mx-8 flex-shrink-0"
                    >
                      <IconComponent className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-400 font-semibold text-lg whitespace-nowrap">
                        {company.name}
                      </span>
                    </div>
                  );
                })}
                {/* Duplicate set for seamless loop */}
                {trustedCompanies.map((company, index) => {
                  const IconComponent = company.icon;
                  return (
                    <div
                      key={`second-${index}`}
                      className="flex items-center space-x-3 mx-6 lg:mx-8 flex-shrink-0"
                    >
                      <IconComponent className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-400 font-semibold text-lg whitespace-nowrap">
                        {company.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Fade edges */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 40s linear infinite;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
    </div>
  );
}
