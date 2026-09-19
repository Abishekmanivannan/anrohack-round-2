import React from 'react';
import { FileText, Sparkles, Trash2, Calendar } from 'lucide-react';
import { Document } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface DocumentCardProps {
  document: Document;
  onSelect: (doc: Document) => void;
  onDelete?: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onSelect,
  onDelete,
}) => {
  const getCategoryVariant = (category: Document['category']) => {
    switch (category) {
      case 'REPORT':
        return 'teal';
      case 'PRESCRIPTION':
        return 'purple';
      case 'DISCHARGE':
        return 'amber';
      case 'BILL':
        return 'blue';
      default:
        return 'slate';
    }
  };

  const formattedDate = new Date(document.uploaded_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card hoverable onClick={() => onSelect(document)} className="group relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getCategoryVariant(document.category)}>
                {document.category}
              </Badge>
              {document.ai_summary && (
                <Badge variant="purple" icon={<Sparkles className="w-3 h-3 text-indigo-400" />}>
                  AI Summarized
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors mt-1.5 line-clamp-1">
              {document.file_name}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Size: {document.file_size}
            </p>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(document.id);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {document.ai_summary && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 line-clamp-2">
          <span className="font-semibold text-teal-300">AI Note: </span>
          {document.ai_summary.summary}
        </div>
      )}

      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          Uploaded {formattedDate}
        </span>
        <span className="text-teal-400 font-semibold flex items-center gap-1 group-hover:underline">
          View Details →
        </span>
      </div>
    </Card>
  );
};
