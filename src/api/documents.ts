import { Document, DocumentCategory, AISummary } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockDocuments } from '../mock/storage';

export interface UploadDocumentInput {
  patient_id: string;
  file_name: string;
  file_size: string;
  category: DocumentCategory;
  file_url?: string;
}

export const documentsApi = {
  getDocuments: async (patientId?: string): Promise<Document[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return patientId ? MockDocuments.getByPatientId(patientId) : MockDocuments.getAll();
    }
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiFetch<Document[]>(`/documents${query}`);
  },

  getDocumentById: async (id: string): Promise<Document> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      const doc = MockDocuments.getById(id);
      if (!doc) throw new Error('Document not found');
      return doc;
    }
    return apiFetch<Document>(`/documents/${id}`);
  },

  uploadDocument: async (input: UploadDocumentInput): Promise<Document> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 500));
      return MockDocuments.upload({
        patient_id: input.patient_id,
        file_name: input.file_name,
        file_size: input.file_size,
        category: input.category,
        file_url: input.file_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      });
    }
    return apiFetch<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  deleteDocument: async (id: string): Promise<void> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const success = MockDocuments.delete(id);
      if (!success) throw new Error('Document not found');
      return;
    }
    await apiFetch(`/documents/${id}`, { method: 'DELETE' });
  },

  generateAISummary: async (documentId: string): Promise<AISummary> => {
    if (isMockMode()) {
      // Simulate realistic AI generation loading delay
      await new Promise(res => setTimeout(res, 1200));
      const doc = MockDocuments.getById(documentId);
      
      // Return custom structured AI summary based on document category
      let summary: AISummary = {
        documentType: `${doc?.category || 'Medical'} Healthcare Record`,
        summary: `AI plain-language summary for ${doc?.file_name || 'document'}: Contains key clinical indicators, diagnostic markers, and routine follow-up details structured for patient understanding.`,
        importantDates: [
          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (Uploaded)',
          'Follow-up recommended within 30 days',
        ],
        mentionedItems: [
          'Primary Diagnostic Finding: Unremarkable / Stable',
          'Vitals & Laboratory Status: Within expected range',
          'Recommended Action: Store in medical vault & present during next appointment',
        ],
        questionsForDoctor: [
          'What do these test/report findings mean for my overall treatment plan?',
          'Are any lifestyle adjustments or follow-up tests advised?',
        ],
      };

      if (doc?.ai_summary) {
        summary = doc.ai_summary;
      } else if (doc) {
        MockDocuments.setAISummary(doc.id, summary);
      }

      return summary;
    }

    return apiFetch<AISummary>(`/documents/${documentId}/summarize`, {
      method: 'POST',
    });
  },
};
