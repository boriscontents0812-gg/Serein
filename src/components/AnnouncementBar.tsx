import React, { useState } from 'react';
import { productData } from '../data/product';
import { Edit3, Check, X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [text, setText] = useState(productData.announcementText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="w-full bg-[#EDF0F3] dark:bg-[#11171A] border-b border-border-light dark:border-border-dark py-2.5 px-4 text-xs tracking-caps uppercase text-ink-light dark:text-ink-dark flex items-center justify-between relative transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center space-x-2 text-center">
        <Sparkles className="w-3 h-3 text-teal hidden sm:inline-block animate-pulse" />
        
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-white dark:bg-[#1C252B] border border-teal text-ink-light dark:text-ink-dark px-2.5 py-0.5 rounded text-xs focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsEditing(false)}
              className="text-teal hover:text-teal-bright transition-colors"
              title="Save announcement"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] sm:text-xs font-normal text-ink-light dark:text-ink-dark tracking-[0.14em]">
            {text}
          </span>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-1 text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-teal transition-colors opacity-70 hover:opacity-100"
          title="Edit announcement text"
          aria-label="Edit announcement text"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-ink-light dark:hover:text-ink-dark p-1 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
