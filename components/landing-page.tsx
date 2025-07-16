"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Star, Rocket, Heart } from "lucide-react";
import Image from "next/image";

export function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: Star, delay: "0s", duration: "6s", color: "text-yellow-400" },
    { icon: Heart, delay: "1s", duration: "8s", color: "text-pink-400" },
    { icon: Zap, delay: "2s", duration: "7s", color: "text-blue-400" },
    { icon: Sparkles, delay: "3s", duration: "9s", color: "text-purple-400" },
    { icon: Rocket, delay: "4s", duration: "6s", color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden ">
      {/* Animated Background */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div> */}

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          style={{
            left: `${10 + index * 20}%`,
            top: `${20 + index * 15}%`,
            animation: `float ${element.duration} ease-in-out infinite`,
            animationDelay: element.delay,
          }}
        >
          <element.icon className="w-8 h-8" />
        </div>
      ))}

      {/* Mouse Follower */}
      <div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={"https://titanscareers.com/assets/logo-DMzVeG9H.png"}
              // layout="responsive"
              alt="Titans Career"
              width={100}
              height={100}
            />{" "}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-black">
            Titans<span className="text-primary">Careers</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
          >
            Sign In
          </Button>
          <Button onClick={() => router.push("/sign-up")}>
            Get Started ✨
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-background rounded-3xl shadow-lg border border-border p-8 md:p-16 max-w-5xl mx-auto mt-4">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start">
          <span className="text-sm text-muted-foreground mb-2">
            Empowering Facilitators • Career Launch Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
            Transform Careers,
            <br /> Inspire Success
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md">
            Save time and deliver impact. TitansCareers gives facilitators the
            tools to create, manage, and deliver transformative educational
            experiences that launch real-world careers.
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 py-4 text-base font-semibold"
            onClick={() => router.push("/login")}
          >
            Login to your dashboard
          </Button>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center mt-10 md:mt-0">
          <Image
            src="https://titanscareers.com/assets/logo-DMzVeG9H.png"
            alt="Titans Careers Illustration"
            width={320}
            height={320}
            className="rounded-2xl shadow-md bg-white"
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
