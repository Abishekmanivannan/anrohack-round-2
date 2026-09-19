import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  Calendar,
  HelpCircle,
  FileText,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AISummary } from '../../types';
import { Button } from '../ui/Button';
import { GlowBorder } from '../react-bits/GlowBorder';
import { BadgePulse } from '../react-bits/BadgePulse';

export interface AISummarySectionProps {
  documentId: string;
  initialSummary?: AISummary;
  onGenerateSummary: (docId: string) => Promise<AISummary>;
}

export const AISummarySection: React.FC<AISummarySectionProps> = ({
  documentId,
  initialSummary,
  onGenerateSummary,
}) => {
  const [summary, setSummary] = useState<AISummary | undefined>(initialSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('questions');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await onGenerateSummary(documentId);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || 'Unable to generate AI summary at this time.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? null : sec);
  };

  const content = (
    <div className="p-6 bg-slate-900 text-white">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                AI DOCUMENT ASSISTANT
              </h3>
              {summary && <BadgePulse color="indigo" label="AI Summarized" />}
            </div>
            <p className="text-xs text-slate-400">
              Plain-language overview & key information extraction
            </p>
          </div>
        </div>

        {!summary && !isGenerating && (
          <Button
            onClick={handleGenerate}
            variant="gradient"
            size="sm"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Generate AI Summary
          </Button>
        )}
      </div>

      {/* Safety Notice */}
      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Informational Summary: </span>
          Generated for document organization only. Does NOT constitute medical diagnosis, treatment recommendations, or prescription guidance. Please consult your physician for medical advice.
        </div>
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-indigo-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-indigo-400 absolute animate-bounce" />
          </div>
          <p className="text-sm font-bold text-white">Processing Medical Document Text...</p>
          <p className="text-xs text-slate-400 max-w-sm">
            Extracting document type, plain-language summaries, key dates, and doctor questions.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isGenerating && (
        <div className="my-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            AI Service Unavailable
          </div>
          <p>{error}</p>
          <div className="mt-1">
            <Button
              onClick={handleGenerate}
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry Generation
            </Button>
          </div>
        </div>
      )}

      {/* Result Display */}
      {summary && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 space-y-5"
        >
          {/* Document Type */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Document Category & Type
            </span>
            <div className="mt-1 font-bold text-white text-sm flex items-center gap-2 bg-indigo-500/10 px-3.5 py-2 rounded-xl border border-indigo-500/20">
              <FileText className="w-4 h-4 text-indigo-400" />
              {summary.documentType}
            </div>
          </div>

          {/* Plain-Language Summary */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Simplified Plain-Language Overview
            </span>
            <p className="mt-1.5 text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-white/10 shadow-card">
              {summary.summary}
            </p>
          </div>

          {/* Extracted Metrics / Mentioned Items */}
          {summary.mentionedItems.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Extracted Metrics & Key Items
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {summary.mentionedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white/5 text-indigo-300 text-xs font-semibold border border-indigo-500/20 shadow-2xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Important Dates */}
          {summary.importantDates.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xs">
              <button
                onClick={() => toggleSection('dates')}
                className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Important Dates Mentioned ({summary.importantDates.length})
                </span>
                {expandedSection === 'dates' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedSection === 'dates' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3.5 pb-3.5 space-y-1.5 border-t border-white/10"
                  >
                    {summary.importantDates.map((dateItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 text-xs text-slate-300 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{dateItem}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Expandable Questions for Doctor */}
          {summary.questionsForDoctor.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xs">
              <button
                onClick={() => toggleSection('questions')}
                className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-white hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Suggested Questions to Ask Your Doctor ({summary.questionsForDoctor.length})
                </span>
                {expandedSection === 'questions' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedSection === 'questions' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3.5 pb-3.5 space-y-2 border-t border-white/10"
                  >
                    {summary.questionsForDoctor.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-200 font-medium flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  return summary ? <GlowBorder>{content}</GlowBorder> : <div className="rounded-2xl border border-white/10 bg-slate-900">{content}</div>;
};
