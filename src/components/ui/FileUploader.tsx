import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { DocumentCategory } from '../../types';

export interface FileUploaderProps {
  onUpload: (fileData: { name: string; size: string; category: DocumentCategory; fileUrl?: string }) => Promise<void>;
  onClose?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('REPORT');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    if (!file.name.match(/\.(pdf|png|jpg|jpeg|doc|docx)$/i)) {
      setError('Supported formats: PDF, PNG, JPG, DOCX');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Maximum file size limit is 20MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(10);
    setError(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      await new Promise(res => setTimeout(res, 800));
      setProgress(100);
      clearInterval(interval);

      await onUpload({
        name: selectedFile.name,
        size: formatSize(selectedFile.size),
        category,
      });

      setIsSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? 'border-teal-400 bg-teal-500/10 scale-[0.99]'
              : 'border-white/20 bg-slate-900/50 hover:bg-white/5 hover:border-white/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            className="hidden"
          />
          <div className="p-3 rounded-full bg-teal-500/20 text-teal-400 mb-3">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-white">
            Drag and drop your medical file here
          </p>
          <p className="text-xs text-slate-400 mt-1">Or click to browse from device (PDF, PNG, JPG, DOCX)</p>
          <span className="mt-3 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-slate-300 font-medium">
            Max 20 MB
          </span>
        </div>
      ) : (
        /* Selected File Overview */
        <div className="p-4 rounded-2xl border border-white/10 bg-slate-900 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white truncate max-w-[220px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedFile.type || 'Document'} • {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isUploading && !isSuccess && (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Selector */}
          {!isUploading && !isSuccess && (
            <Select
              label="Document Category"
              value={category}
              onChange={e => setCategory(e.target.value as DocumentCategory)}
              options={[
                { value: 'REPORT', label: 'Test Report / Lab Results' },
                { value: 'PRESCRIPTION', label: 'Doctor Prescription' },
                { value: 'BILL', label: 'Medical Bill / Invoice' },
                { value: 'DISCHARGE', label: 'Hospital Discharge Summary' },
                { value: 'OTHER', label: 'Other Document' },
              ]}
            />
          )}

          {/* Progress bar */}
          {isUploading && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  Uploading file...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success message */}
          {isSuccess && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Upload complete! Document added to your vault.
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      {selectedFile && !isSuccess && (
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFile(null)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSubmit}
            isLoading={isUploading}
            icon={<UploadCloud className="w-4 h-4" />}
          >
            Upload Now
          </Button>
        </div>
      )}
    </div>
  );
};
