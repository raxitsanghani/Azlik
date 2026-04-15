
import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-premium-platinum/30 ${className}`}></div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen dashboard-gradient py-12 px-4 sm:px-6 lg:px-8 space-y-12">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-4 w-full md:w-auto">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-64 md:w-96" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
    </div>
    
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="premium-card p-10 h-96 space-y-8">
          <div className="flex gap-4">
            <Skeleton className="w-12 h-12" />
            <Skeleton className="h-6 w-32 mt-3" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { Skeleton, DashboardSkeleton };
