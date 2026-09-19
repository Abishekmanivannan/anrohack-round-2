import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Document, DocumentCategory } from '../types';
import { documentsApi } from '../api/documents';
import { FileText, Search, UploadCloud } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { DocumentCard } from '../components/domain/DocumentCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { FileUploader } from '../components/ui/FileUploader';
import { useToast } from '../context/ToastContext';
import FuseButton from '../components/react-bits/FuseButton';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentsApi.getDocuments(user?.id);
      setDocuments(data);
    } catch (err) {
      showToast('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleUpload = async (fileData: { name: string; size: string; category: DocumentCategory }) => {
    try {
      await documentsApi.uploadDocument({
        patient_id: user?.id || 'patient-1',
        file_name: fileData.name,
        file_size: fileData.size,
        category: fileData.category,
      });
      showToast('Document uploaded successfully!', 'success');
      loadDocuments();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentsApi.deleteDocument(id);
      showToast('Document deleted', 'info');
      loadDocuments();
    } catch (err: any) {
      showToast('Failed to delete document', 'error');
    }
  };

  const getFilteredDocuments = () => {
    let list = documents;
    if (activeCategory !== 'all') {
      list = list.filter(d => d.category === activeCategory.toUpperCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        d =>
          d.file_name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.ai_summary?.summary.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filteredDocs = getFilteredDocuments();

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            Medical Document Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, search, categorize, and generate AI plain-language summaries for your healthcare records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FuseButton
            label="Archive Vault"
            undoLabel="Undo Archive"
            doneLabel="Vault Archived"
            size="md"
            undoWindow={4000}
            fuse="outline"
            color="#94a3b8"
            background="rgba(30, 41, 59, 0.8)"
            fuseColor="#14b8a6"
            onCommit={() => showToast('Vault state archived', 'info')}
            onUndo={() => showToast('Archive undone!', 'success')}
          />

          <Button
            variant="gradient"
            size="md"
            onClick={() => setShowUploadModal(true)}
            icon={<UploadCloud className="w-4 h-4" />}
          >
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'all', label: 'All Vault', count: documents.length },
              { id: 'report', label: 'Lab Reports', count: documents.filter(d => d.category === 'REPORT').length },
              { id: 'prescription', label: 'Prescriptions', count: documents.filter(d => d.category === 'PRESCRIPTION').length },
              { id: 'discharge', label: 'Discharge', count: documents.filter(d => d.category === 'DISCHARGE').length },
              { id: 'bill', label: 'Bills', count: documents.filter(d => d.category === 'BILL').length },
            ]}
            activeTab={activeCategory}
            onChange={setActiveCategory}
          />

          <div className="w-full md:w-64">
            <Input
              placeholder="Search file name or AI note..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onSelect={d => navigate(`/documents/${d.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No documents found"
          description={
            searchQuery
              ? `No files matching "${searchQuery}".`
              : 'Upload your first medical report, prescription, or discharge summary.'
          }
          actionLabel="Upload Document"
          onAction={() => setShowUploadModal(true)}
          actionIcon={<UploadCloud className="w-4 h-4" />}
        />
      )}

      {/* File Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Medical Document"
        description="Select a medical file (PDF, PNG, JPG, DOCX) to add to your secure digital vault."
        maxWidth="lg"
      >
        <FileUploader onUpload={handleUpload} onClose={() => setShowUploadModal(false)} />
      </Modal>
    </div>
  );
};
