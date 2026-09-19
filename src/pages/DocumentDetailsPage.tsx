import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, AISummary } from '../types';
import { documentsApi } from '../api/documents';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Trash2,
  Tag,
  ExternalLink,
  HardDrive,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { AISummarySection } from '../components/domain/AISummarySection';
import { useToast } from '../context/ToastContext';
import HoldButton from '../components/react-bits/HoldButton';

export const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocument = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getDocumentById(id);
      setDocument(data);
    } catch (err: any) {
      setError(err.message || 'Document not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [id]);

  const handleGenerateSummary = async (docId: string): Promise<AISummary> => {
    const summary = await documentsApi.generateAISummary(docId);
    showToast('AI Document summary generated!', 'success');
    if (document) {
      setDocument({ ...document, ai_summary: summary });
    }
    return summary;
  };

  const handleDelete = async () => {
    if (!document) return;
    try {
      await documentsApi.deleteDocument(document.id);
      showToast('Document deleted', 'info');
      navigate('/documents');
    } catch (err: any) {
      showToast('Failed to delete document', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-xl mx-auto">
        <ErrorState message={error || 'Document unavailable'} onRetry={loadDocument} />
      </div>
    );
  }

  const formattedDate = new Date(document.uploaded_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4 text-white">
      {/* Back link */}
      <button
        onClick={() => navigate('/documents')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Document Vault
      </button>

      {/* Header card */}
      <Card className="p-6 bg-slate-900 border-white/10">
        <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="teal">{document.category}</Badge>
                <span className="text-xs text-slate-400 font-medium">{document.file_size}</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">{document.file_name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href={document.file_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Preview PDF
              </Button>
            </a>
            <HoldButton
              size="sm"
              holdTime={1500}
              backgroundColor="rgba(225, 29, 72, 0.15)"
              fillColor="#e11d48"
              textColor="#fda4af"
              fillTextColor="#ffffff"
              icon={<Trash2 className="w-4 h-4 text-rose-400" />}
              doneIcon={<Trash2 className="w-4 h-4 text-white" />}
              doneLabel="Deleting..."
              onHold={handleDelete}
            >
              Hold to Delete
            </HoldButton>
          </div>
        </div>

        {/* Metadata info */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
            <span className="font-bold text-slate-400 block mb-0.5">Uploaded Date</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              {formattedDate}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
            <span className="font-bold text-slate-400 block mb-0.5">Category</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              {document.category}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 col-span-2 sm:col-span-1">
            <span className="font-bold text-slate-400 block mb-0.5">File Size</span>
            <span className="font-bold text-white flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-teal-400" />
              {document.file_size}
            </span>
          </div>
        </div>
      </Card>

      {/* Document Visual Viewer Container */}
      <Card className="p-5 bg-slate-900 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{document.file_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Encrypted medical file stored securely in cloud object vault.
              </p>
            </div>
          </div>
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              Open PDF Viewer
            </Button>
          </a>
        </div>
      </Card>

      {/* AI Document Assistant Section */}
      <AISummarySection
        documentId={document.id}
        initialSummary={document.ai_summary}
        onGenerateSummary={handleGenerateSummary}
      />
    </div>
  );
};
