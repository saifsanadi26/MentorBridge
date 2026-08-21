"use client";

import React, { useState } from 'react';
import { Upload, X, User } from "lucide-react";

export default function MentorPhotoUpload({ onPhotoSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Validate File Type
      if (!file.type.startsWith("image/")) return alert("Please upload an image file.");

      // 2. Create Preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onPhotoSelect(reader.result); // This sends the Base64 string to the parent
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Mentor Portrait</label>
      
      <div className="relative group w-32 h-32 mx-auto">
        <div className="w-full h-full rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden transition-all group-hover:border-cyan-500">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-slate-700 group-hover:text-cyan-500 transition-colors" />
          )}
        </div>
        
        {/* The Hidden Input */}
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />

        {preview && (
          <button 
            onClick={() => setPreview(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg z-30"
          >
            <X size={12} />
          </button>
        )}
      </div>
      
      <p className="text-center text-[10px] text-slate-500 italic">Drag and drop or click to upload</p>
    </div>
  );
}