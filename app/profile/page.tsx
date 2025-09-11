"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Mail, Phone, GraduationCap, CheckCircle, MessageCircle } from "lucide-react";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "Theresa Flores",
    title: "Senior Teacher at Tiger School",
    about: `Hello, my name is Theresa Flores. I come from Australia. I graduated from DaMI and got a PHD degree. My major is Academic Studies. I have 4 year(s) teaching experience. I have taught all subjects, many different age groups, in various schools, to make learning engaging. My hobby is/are bake. My profession is a professional.`,
    location: "Melbourne, Australia",
    email: "theresa.flores@email.com",
    phone: "+61 123 456 789",
    tags: ["English grammar", "Online education", "Pre-school education", "Foreign languages"],
  });

  const education = [
    {
      school: "The University of Melbourne",
      degree: "Master’s degree, Foreign languages",
      period: "Sep 2007 - Aug 2012",
      credential: "#1-UMELB-2023"
    },
    {
      school: "The University of Sydney",
      degree: "Bachelor’s degree, Bachelor of Architecture and Environments",
      period: "May 2013 - Aug 2017",
      credential: "#2-USYD-2017"
    }
  ];

  const courses = [
    { name: "English Language Arts", lessons: "9 lessons/1 month", status: "Ongoing Now", price: "$129.00" },
    { name: "Math", lessons: "8 lessons/3 weeks", status: "Start Soon", price: "$165.00" },
    { name: "Art History", lessons: "10 lessons/3 weeks", status: "Ongoing Now", price: "$170.00" },
    { name: "Architecture", lessons: "59 lessons/5 month", status: "Start Soon", price: "$300.00" },
    { name: "French Language", lessons: "19 lessons/2 month", status: "Start Soon", price: "$150.00" },
    { name: "Spanish Language", lessons: "27 lessons/3 month", status: "Unavailable", price: "$120.00" },
  ];

interface HandleChangeEvent {
    target: {
        name: keyof ProfileForm;
        value: string;
    };
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | HandleChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev: ProfileForm) => ({ ...prev, [name]: value }));
};

interface HandleTagChange {
    (i: number, value: string): void;
}

const handleTagChange: HandleTagChange = (i, value) => {
    setForm((prev: ProfileForm) => {
        const tags = [...prev.tags];
        tags[i] = value;
        return { ...prev, tags };
    });
};

  const handleAddTag = () => {
    setForm((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

interface ProfileForm {
    name: string;
    title: string;
    about: string;
    location: string;
    email: string;
    phone: string;
    tags: string[];
}



const handleRemoveTag = (i: number) => {
    setForm((prev: ProfileForm) => {
        const tags = prev.tags.filter((_, idx) => idx !== i);
        return { ...prev, tags };
    });
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditMode(false);
};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-1/3 w-full space-y-6">
            <Card className="p-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg bg-gray-200 mb-4 flex items-center justify-center text-5xl font-bold text-primary">
                TF
              </div>
              <div className="text-center">
                {!editMode ? (
                  <>
                    <h2 className="text-2xl font-bold mb-1">{form.name}</h2>
                    <p className="text-muted-foreground mb-2">{form.title}</p>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg font-bold text-gray-800 mb-1"
                      type="text"
                      required
                    />
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-muted-foreground mb-2"
                      type="text"
                      required
                    />
                  </form>
                )}
                <div className="flex justify-center gap-2 mb-4 mt-2">
                  <Button size="sm" variant="default">Book a Class</Button>
                  <Button size="sm" variant="outline"><MessageCircle className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditMode((v) => !v)}>
                    {editMode ? "Cancel" : "Edit"}
                  </Button>
                </div>
                {editMode && (
                  <Button size="sm" variant="default" type="submit" className="w-full mb-2">Save</Button>
                )}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">About me</h3>
              {!editMode ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">{form.about}</p>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 mb-2"
                    rows={4}
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <input
                          value={tag}
                          onChange={(e) => handleTagChange(i, e.target.value)}
                          className="rounded border px-2 py-1 text-xs"
                        />
                        <Button size="icon" variant="ghost" type="button" onClick={() => handleRemoveTag(i)}>
                          ×
                        </Button>
                      </span>
                    ))}
                    <Button size="sm" variant="outline" type="button" onClick={handleAddTag}>+ Tag</Button>
                  </div>
                </form>
              )}
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Contact Info</h3>
              {!editMode ? (
                <>
                  <div className="flex items-center gap-2 text-sm mb-1"><MapPin className="w-4 h-4" /> {form.location}</div>
                  <div className="flex items-center gap-2 text-sm mb-1"><Mail className="w-4 h-4" /> {form.email}</div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> {form.phone}</div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-1"
                    type="text"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-1"
                    type="email"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    type="text"
                  />
                </form>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:w-2/3 w-full space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Educational Background</h3>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <GraduationCap className="w-8 h-8 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">{edu.school}</div>
                      <div className="text-sm text-muted-foreground">{edu.degree}</div>
                      <div className="text-xs text-gray-400 mb-1">{edu.period}</div>
                      <div className="text-xs text-primary flex items-center gap-1">
                        Show credential <CheckCircle className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Courses</h3>
                <Button size="sm" variant="outline">Sort by: All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Course</th>
                      <th className="py-2">Lessons</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{c.name}</td>
                        <td className="py-2">{c.lessons}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${c.status === "Ongoing Now" ? "bg-green-100 text-green-700" : c.status === "Start Soon" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{c.status}</span>
                        </td>
                        <td className="py-2">{c.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
