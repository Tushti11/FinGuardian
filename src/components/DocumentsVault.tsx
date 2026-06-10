/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, Plus, Search, Calendar, FolderOpen, Eye, X } from 'lucide-react';
import { Document, DocumentCategory } from '../types';

interface DocumentsVaultProps {
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

const CATEGORIES: DocumentCategory[] = [
  'Insurance Policies',
  'Property Documents',
  'Loan Documents',
  'Tax Documents',
  'PAN',
  'Aadhaar',
  'Digital Will',
];

export default function DocumentsVault({ documents, onAddDocument, onDeleteDocument }: DocumentsVaultProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered documents
  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  // Drag and Drop simulation mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const fileCategory: DocumentCategory = selectedCategory !== 'All' ? selectedCategory : 'Insurance Policies';
    const newId = `doc_${Date.now()}`;

    const newDoc: Document = {
      id: newId,
      name: file.name,
      category: fileCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      ocrStatus: 'processing',
    };

    onAddDocument(newDoc);

    // Simulate OCR Scanning step
    setTimeout(() => {
      // Find matching dynamic AI summaries
      let mockOcrSummary = `Successfully scanned ${file.name}. Holder: Aditya Sharma. Valid and digitally cross-referenced.`;
      if (file.name.toLowerCase().includes('insurance')) {
        mockOcrSummary = 'Term cover processed. Insured: Aditya Sharma. Sum assured evaluated at ₹1 Crore. Premium payment recorded as Active.';
      } else if (file.name.toLowerCase().includes('will')) {
        mockOcrSummary = 'Digital Testament scanner: Confirmed signature and notarization. Distribution matches original digital ledger settings.';
      } else if (file.name.toLowerCase().includes('tax') || file.name.toLowerCase().includes('form')) {
        mockOcrSummary = 'Form 16 Tax Statement. Income recognized: ₹32,00,000. Under current assessable schedule of Central Board of Direct Taxes.';
      }

      onAddDocument({
        ...newDoc,
        ocrStatus: 'completed',
        summary: mockOcrSummary,
      });

    }, 3000);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="docs-root" className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Secure Encrypted Vault</h2>
        <p className="text-slate-400 text-sm">Upload, decrypt, and manage critical statutory certificates. Complete OCR handles automatic nominee retrieval mapping.</p>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-brand-accent border-brand-accent text-brand-dark'
              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((catString) => (
          <button
            key={catString}
            onClick={() => setSelectedCategory(catString)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
              selectedCategory === catString
                ? 'bg-brand-accent border-brand-accent text-brand-dark'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {catString}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column (Takes 1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer glass-panel py-12 px-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all min-h-[320px] ${
              dragActive ? 'border-brand-accent bg-brand-accent/5' : 'border-white/10'
            }`}
            onClick={triggerFileSelect}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <div className="bg-brand-accent/10 p-5 rounded-2xl text-brand-accent mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h4 className="font-semibold text-white">Drag & Drop Legacy File</h4>
            <p className="text-slate-400 text-xs mt-1.5 max-w-[200px] mx-auto">Upload PDF deeds, PAN cards, Wills, or insurance policies</p>
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full mt-4 block">
              MAX SIZE: 15MB
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-brand-medium/20 border border-white/5 space-y-3">
            <h5 className="text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" /> FinGuardian OCR Engine
            </h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              When documents are uploaded, our secure offline sanitizers automatically scan tax records, owner signatures, terms, and lock dates to feed family backup routers instantly.
            </p>
          </div>
        </div>

        {/* List Column (Takes 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-[#070c12] p-4 rounded-2xl border border-white/5">
            <span className="text-slate-400 text-xs font-semibold font-mono tracking-wider">
              {filteredDocs.length} VAULT DOCUMENTS FOUND
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-2xl">
              <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-white font-medium">No Vault Files Match</h4>
              <p className="text-slate-500 text-xs mt-1">Upload files under this category code using the left uploader tab.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-panel p-4 rounded-2xl border border-white/[0.04] flex items-center justify-between gap-4 hover:border-brand-accent/25 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="bg-white/5 p-3 rounded-xl inline-flex text-slate-300 shrink-0">
                      <FileText className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-sm truncate pr-2" title={doc.name}>
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                        <span>•</span>
                        <span className="text-brand-accent uppercase font-bold">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* OCR Status */}
                    {doc.ocrStatus === 'processing' ? (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        OCR PARSING
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 rounded inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-brand-accent" />
                        OCR READABLE
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-slate-300"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 p-2 font-mono"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-[#060c16]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0B192C] w-full max-w-lg p-8 rounded-3xl border border-white/10 relative">
            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6 border-b border-white/5 pb-4">
              <div className="bg-brand-accent/15 p-3.5 rounded-xl text-brand-accent">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">{selectedDocForPreview.name}</h3>
                <span className="text-xs text-brand-accent font-mono font-semibold uppercase">{selectedDocForPreview.category}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">UPLOAD ON</span>
                  <span className="text-white font-bold">{selectedDocForPreview.uploadDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">SIZE</span>
                  <span className="text-white font-bold">{selectedDocForPreview.fileSize}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] font-mono block font-semibold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-accent" /> AI OCR STATUTORY EXTRACTS
                </span>
                <div className="p-4 bg-brand-dark/60 rounded-2xl border border-white/5 text-sm text-slate-200 leading-relaxed font-sans max-h-48 overflow-y-auto">
                  {selectedDocForPreview.summary ? (
                    selectedDocForPreview.summary
                  ) : selectedDocForPreview.ocrStatus === 'processing' ? (
                    <span className="text-slate-400 font-mono text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Sanitizing documents & analyzing key clauses in the background...
                    </span>
                  ) : (
                    "No AI extracts summarized. This could be due to a hand-drafted scan. Request manual override to extract details."
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="w-full mt-6 bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
            >
              Close Ledger Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
