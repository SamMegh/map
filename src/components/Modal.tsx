import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  );
}
