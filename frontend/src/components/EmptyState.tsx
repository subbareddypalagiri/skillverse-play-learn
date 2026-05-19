import { LucideIcon, Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon = Inbox, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="relative mb-5">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary/70" />
      </div>
      <div className="absolute -inset-2 rounded-3xl bg-primary/5 -z-10 blur-sm" />
    </div>
    <h3 className="text-base font-bold text-foreground mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
    {description && (
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">{description}</p>
    )}
    {actionLabel && onAction && (
      <button onClick={onAction}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] group"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
        {actionLabel}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    )}
  </div>
);

export default EmptyState;
