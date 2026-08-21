"use client";

import React from 'react';

// --- MOCK USER PROFILE ---
const CURRENT_USER = {
  targetCountry: "Germany",
  targetRole: "Data Scientist",
  skills: ["Python", "SQL", "Tableau"],
  interests: ["Football", "Tech"]
};

// --- FULL MENTOR DATABASE (All 15) ---
const MENTORS = [
  { id: 1, name: "Dr. Klaus Mueller", role: "Lead Data Scientist", company: "BMW Group", country: "Germany", skills: ["Python", "TensorFlow"], interests: ["Football"], image: "https://i.pravatar.cc/150?u=1", availability: "High" },
  { id: 2, name: "Sarah Jenkins", role: "Senior PM", company: "Google", country: "USA", skills: ["Strategy", "SQL"], interests: ["Tech"], image: "https://i.pravatar.cc/150?u=2", availability: "Medium" },
  { id: 3, name: "Rahul Deshmukh", role: "AI Researcher", company: "DeepMind", country: "UK", skills: ["Python", "PyTorch"], interests: ["Cricket"], image: "https://i.pravatar.cc/150?u=3", availability: "Low" },
  { id: 4, name: "Emily Chen", role: "Software Engineer", company: "Shopify", country: "Canada", skills: ["React", "Node.js"], interests: ["Photography"], image: "https://i.pravatar.cc/150?u=4", availability: "High" },
  { id: 5, name: "Alessandro Rossi", role: "Product Manager", company: "Zalando", country: "Germany", skills: ["Agile", "Strategy"], interests: ["Football"], image: "https://i.pravatar.cc/150?u=5", availability: "Medium" },
  { id: 6, name: "Priya Sharma", role: "Data Analyst", company: "Amazon", country: "USA", skills: ["SQL", "Tableau"], interests: ["Yoga"], image: "https://i.pravatar.cc/150?u=6", availability: "High" },
  { id: 7, name: "Hans Weber", role: "ML Engineer", company: "Siemens", country: "Germany", skills: ["C++", "Python"], interests: ["Hiking"], image: "https://i.pravatar.cc/150?u=7", availability: "Medium" },
  { id: 8, name: "Jessica Wu", role: "UX Researcher", company: "Meta", country: "USA", skills: ["Figma", "User Research"], interests: ["Art"], image: "https://i.pravatar.cc/150?u=8", availability: "Low" },
  { id: 9, name: "Liam O'Brien", role: "Cloud Architect", company: "Microsoft", country: "Ireland", skills: ["Azure", "Docker"], interests: ["Rugby"], image: "https://i.pravatar.cc/150?u=9", availability: "High" },
  { id: 10, name: "Yuki Tanaka", role: "Robotics Eng", company: "Toyota", country: "Japan", skills: ["ROS", "Python"], interests: ["Anime"], image: "https://i.pravatar.cc/150?u=10", availability: "Medium" },
  { id: 11, name: "Amara Okoro", role: "Cybersecurity", company: "IBM", country: "UK", skills: ["Security+", "Linux"], interests: ["Music"], image: "https://i.pravatar.cc/150?u=11", availability: "High" },
  { id: 12, name: "David Miller", role: "Full Stack", company: "Stripe", country: "USA", skills: ["Next.js", "Go"], interests: ["Tech"], image: "https://i.pravatar.cc/150?u=12", availability: "Medium" },
  { id: 13, name: "Sofia Garcia", role: "Project Lead", company: "Airbus", country: "France", skills: ["PMP", "Scrum"], interests: ["Travel"], image: "https://i.pravatar.cc/150?u=13", availability: "Low" },
  { id: 14, name: "Ben Wilson", role: "DevOps", company: "Atlassian", country: "Australia", skills: ["K8s", "Terraform"], interests: ["Surfing"], image: "https://i.pravatar.cc/150?u=14", availability: "High" },
  { id: 15, name: "Zainab Ali", role: "NLP Researcher", company: "OpenAI", country: "USA", skills: ["LLMs", "Python"], interests: ["Reading"], image: "https://i.pravatar.cc/150?u=15", availability: "Medium" }
];

export default function SmartMatch({ query = "" }) {
  // --- MATCHING ALGORITHM ---
  const calculateMatch = (mentor) => {
    let score = 60; 
    const reasons = [];

    if (mentor.country === CURRENT_USER.targetCountry) {
      score += 15;
      reasons.push(`🎯 Target Country: ${mentor.country}`);
    }

    const sharedSkills = mentor.skills.filter(s => CURRENT_USER.skills.includes(s));
    score += sharedSkills.length * 5;
    if (sharedSkills.length > 0) reasons.push(`💻 Shared Skills: ${sharedSkills.join(", ")}`);

    const sharedInterests = mentor.interests.filter(i => CURRENT_USER.interests.includes(i));
    if (sharedInterests.length > 0) {
      score += 5;
      reasons.push(`⚽ Common Interest: ${sharedInterests[0]}`);
    }

    return { score: Math.min(score, 99), reasons };
  };

  // --- FILTERING & SORTING LOGIC ---
  const processedMentors = MENTORS.map(m => ({ ...m, ...calculateMatch(m) }))
    .filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) || 
      m.role.toLowerCase().includes(query.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => b.score - a.score);

  return (
    <div className="w-full">
      {processedMentors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedMentors.map((mentor) => (
            <div key={mentor.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              
              {/* MATCH BADGE */}
              <div className="absolute top-4 right-4">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-4 font-black text-sm ${mentor.score > 85 ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-amber-500 text-amber-400'}`}>
                  {mentor.score}%
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover" />
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{mentor.name}</h3>
                  <p className="text-slate-400 text-xs">{mentor.role} @ {mentor.company}</p>
                  <span className="text-xs font-mono text-cyan-400 mt-1 block">{mentor.country}</span>
                </div>
              </div>

              {/* Explainable AI Box */}
              <div className="bg-slate-950/50 rounded-xl p-3 mb-4 border border-slate-800">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Match Analysis</p>
                 <ul className="space-y-1">
                   {mentor.reasons.map((r, i) => (
                     <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                       {r}
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Actions */}
              <button className="w-full py-2 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 rounded-lg font-bold text-sm transition-all">
                View Profile & Schedule
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
           <div className="text-4xl mb-4 text-slate-700">🔍</div>
           <h3 className="text-white font-bold text-lg uppercase">No Agents Found</h3>
           <p className="text-slate-500 text-sm">Adjust your search parameters to find a different match.</p>
        </div>
      )}
    </div>
  );
}