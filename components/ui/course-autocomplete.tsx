"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, BookOpen } from "lucide-react";

interface CourseAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const POPULAR_COURSES = [
  // Technology & Programming
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Software Engineering",
  "Python Programming",
  "JavaScript Development",
  "React Development",
  "Node.js Development",
  "Database Management",
  "UI/UX Design",

  // Business & Management
  "Digital Marketing",
  "Project Management",
  "Business Analytics",
  "Entrepreneurship",
  "Leadership Development",
  "Sales Training",
  "Customer Service",
  "Human Resources",
  "Financial Management",
  "Supply Chain Management",
  "Operations Management",
  "Strategic Planning",

  // Creative & Design
  "Graphic Design",
  "Video Production",
  "Photography",
  "Content Creation",
  "Social Media Marketing",
  "Brand Management",
  "Creative Writing",
  "Animation",
  "3D Modeling",
  "Interior Design",

  // Healthcare & Life Sciences
  "Nursing",
  "Medical Technology",
  "Healthcare Administration",
  "Pharmacy",
  "Physical Therapy",
  "Mental Health Counseling",
  "Nutrition",
  "Public Health",

  // Education & Training
  "Early Childhood Education",
  "Special Education",
  "Adult Education",
  "Corporate Training",
  "Instructional Design",
  "Educational Technology",

  // Trades & Technical
  "Electrical Engineering",
  "Mechanical Engineering",
  "Automotive Technology",
  "Construction Management",
  "HVAC Technology",
  "Plumbing",
  "Welding",
  "Carpentry",

  // Finance & Accounting
  "Accounting",
  "Financial Planning",
  "Investment Management",
  "Tax Preparation",
  "Bookkeeping",
  "Risk Management",

  // Communication & Languages
  "Public Speaking",
  "Technical Writing",
  "English as Second Language",
  "Translation Services",
  "Communications",
  "Journalism",

  // Other Professional Skills
  "Career Counseling",
  "Life Coaching",
  "Personal Development",
  "Time Management",
  "Conflict Resolution",
  "Negotiation Skills",
];

export function CourseAutocomplete({
  value,
  onChange,
  placeholder,
}: CourseAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim() === "") {
      setFilteredCourses([]);
      return;
    }

    const filtered = POPULAR_COURSES.filter((course) =>
      course.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions

    setFilteredCourses(filtered);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectCourse = (course: string) => {
    onChange(course);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (filteredCourses.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10"
          placeholder={placeholder}
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {isOpen && filteredCourses.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg backdrop-blur-sm max-h-64 overflow-y-auto">
          <div className="p-2">
            {filteredCourses.map((course, index) => (
              <button
                key={index}
                onClick={() => handleSelectCourse(course)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{course}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && value.trim() !== "" && filteredCourses.length === 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg backdrop-blur-sm">
          <div className="p-4 text-center text-muted-foreground text-sm">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p>No matching courses found.</p>
            <p className="text-xs mt-1 text-muted-foreground/70">
              You can still enter your custom course name.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
