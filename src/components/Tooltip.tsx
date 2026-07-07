import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({ children, content, side = 'bottom' }: TooltipProps) {
  const sideClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className={`absolute z-9999 whitespace-nowrap bg-neutral-900/90 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none shadow-lg backdrop-blur-sm border border-white/10 ${sideClasses[side]}`}>
        {content}
      </div>
    </div>
  );
}
