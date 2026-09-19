import React, { useState } from 'react';
import { MessageCircle, SendHorizonal, Sparkles, Pill, Loader2, Stethoscope } from 'lucide-react';
import { Button } from './ui/Button';
import { getHealthcareAssistantReply, ChatMessage } from '../api/llm';

const starterPrompts = [
  'I have a fever and feel weak',
  'I have a cough and sore throat',
  'I have a headache and body pain',
];

export const AIChatbox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help you describe symptoms, suggest likely care actions, and recommend general medicine ideas. Tell me what you are feeling.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);
  const [lastMedicines, setLastMedicines] = useState<{ name: string; reason: string }[]>([]);

  const sendMessage = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setDraft('');
    setIsLoading(true);

    try {
      const result = await getHealthcareAssistantReply(nextMessages);
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: result.response },
      ]);
      setLastSuggestions(result.suggestions);
      setLastMedicines(result.medicines);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'I could not reach the AI service right now, but I can still help with general symptom guidance. Please share your symptoms and how long they have been present.',
        },
      ]);
      setLastSuggestions(['I have fever and body aches', 'I have a persistent cough', 'I have stomach pain and nausea']);
      setLastMedicines([{ name: 'Symptom monitoring', reason: 'Care should always match your symptoms and any other medicines you take.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-2xl backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-4 py-3 bg-slate-50 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-teal-50 dark:bg-teal-500/15 p-2 text-teal-600 dark:text-teal-300">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">AI Health Assistant</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Clinical guidance</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/10 px-2 py-1 text-[10px] font-bold text-teal-700 dark:text-teal-300">
          <Sparkles className="w-3 h-3" /> OPEN API
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-teal-200 dark:border-teal-500/20 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1.5 text-[11px] font-medium text-teal-700 dark:text-teal-200 transition hover:bg-teal-100 dark:hover:bg-teal-500/20"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="max-h-72 overflow-y-auto space-y-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-3 border border-slate-100 dark:border-transparent">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'ml-auto bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 font-medium shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-transparent shadow-xs dark:shadow-none'
              }`}
            >
              {message.content}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-transparent">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-300" />
              Thinking about your symptoms...
            </div>
          )}
        </div>

        {(lastSuggestions.length > 0 || lastMedicines.length > 0) && (
          <div className="space-y-3 rounded-2xl border border-teal-200 dark:border-teal-500/20 bg-teal-50/50 dark:bg-teal-500/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
              <Stethoscope className="w-3.5 h-3.5" />
              Suggested guidance
            </div>

            {lastSuggestions.length > 0 && (
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {lastSuggestions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {lastMedicines.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-300" />
                  Medicine ideas
                </div>
                {lastMedicines.map((medicine) => (
                  <div key={medicine.name} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-2.5 shadow-xs dark:shadow-none">
                    <p className="font-semibold text-slate-900 dark:text-white">{medicine.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{medicine.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 p-3">
            <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">Message</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Describe your symptoms or ask for medicine suggestions..."
              className="min-h-[72px] w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-300" />
              Uses your OpenAI-compatible API key when configured
            </div>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={() => sendMessage(draft)}
              disabled={!draft.trim() || isLoading}
              icon={<SendHorizonal className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
