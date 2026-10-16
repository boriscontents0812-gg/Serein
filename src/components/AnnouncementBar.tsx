import React, { useState } from 'react';
import { productData } from '../data/product';
import { Edit3, Check, X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [text, setText] = useState(productData.announcementText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="w-full bg-[#0E1114] border-b border-white/5 py-2.5 px-4 text-xs tracking-caps uppercase text-neutral-300 flex items-center justify-between relative transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center space-x-2 text-center">
        <Sparkles className="w-3 h-3 text-[#EAA858] hidden sm:inline-block" />
        
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-[#181C20] border border-[#EAA858] text-white px-2.5 py-0.5 rounded text-xs focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#EAA858] hover:text-[#F4B266] transition-colors"
              title="Save announcement"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] sm:text-xs font-medium text-neutral-300 tracking-[0.16em]">
            {text}
          </span>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-1 text-neutral-500 hover:text-[#EAA858] transition-colors opacity-70 hover:opacity-100 p-0.5"
          title="Edit announcement text"
          aria-label="Edit announcement text"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="text-neutral-500 hover:text-white p-1 transition-colors cursor-pointer"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
