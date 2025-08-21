"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Award,
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
import { ModeToggle } from "./mode-toggle";

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 dark:bg-slate-300 rounded-sm">
              <Image
                src="https://titanscareers.com/assets/logo-DMzVeG9H.png"
                alt="Titans Career"
                width={100}
                height={50}
                className="rounded-full "
              />
            </div>

         

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="dark:text-white text-slate-600 hover:text-slate-900"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/sign-up")}
                className="bg-primary hover:bg-primary/80 text-white dark:bg-blue-900 lg:mr-10"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <ModeToggle />
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
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-primary/80 px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-900">
                <Award className="w-4 h-4" />
                <span>Empowering Facilitators</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-500 leading-tight dark:text-white">
                Super minimal
                <br />
                way to start your
                <br />
                <span className="text-primary">online courses!</span>
              </h1>

              <p className="text-xl text-slate-900 dark:text-slate-200 leading-relaxed max-w-lg">
                A comprehensive platform for facilitators to create courses,
                manage students, schedule live classes, and track progress—all
                in one place.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => router.push("/sign-up")}
                className="bg-primary hover:bg-primary/80 text-white px-8 py-4 text-base font-semibold dark:bg-blue-900"
              >
                Sign up
              </Button>

              <button
                onClick={() => router.push("/login")}
                className="dark:text-white text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center space-x-2 mt-3"
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
        <div className="flex items-start h-full">
          <div className="flex items-start justify-center w-full xl:w-[900px] 2xl:w-[1200px] min-h-[520px] lg:min-h-[650px] pt-30">
            <Image
              src="/images/hero1.png"
              alt="Hero Image"
              width={1200}
              height={1200}
              className="object-contain w-full h-full max-h-full rounded-2xl shadow-lg bg-white dark:bg-slate-900 self-start"
              priority
            />
          </div>
        </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-slate-200 bg-slate-50 overflow-hidden dark:bg-black">
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
