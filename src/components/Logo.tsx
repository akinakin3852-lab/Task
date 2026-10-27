import { Layers } from 'lucide-react';

export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className.includes('h-') ? '' : ''}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
        <Layers className="h-5 w-5" />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">Organize</span>
    </div>
  );
}
