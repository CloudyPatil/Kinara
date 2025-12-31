import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-lagoon-900 rounded-[2rem] p-3 border border-petrol-100 dark:border-white/5 shadow-sm">
      {/* Image Placeholder with Shimmer */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-petrol-100 dark:bg-white/5">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
      </div>

      <div className="mt-4 px-2 space-y-3">
        {/* Title Shimmer */}
        <div className="h-6 w-3/4 bg-petrol-100 dark:bg-white/5 rounded-full overflow-hidden relative">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
        </div>
        
        {/* Location Shimmer */}
        <div className="h-4 w-1/2 bg-petrol-50 dark:bg-white/5 rounded-full overflow-hidden relative">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
        </div>

        {/* Footer Shimmer */}
        <div className="pt-3 flex justify-between items-end">
          <div className="h-8 w-24 bg-petrol-100 dark:bg-white/5 rounded-xl overflow-hidden relative">
             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
          </div>
          <div className="h-10 w-10 rounded-full bg-petrol-50 dark:bg-white/5 overflow-hidden relative">
             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}