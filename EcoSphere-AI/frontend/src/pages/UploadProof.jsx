import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';
import { 
  ArrowLeftIcon, 
  DocumentArrowUpIcon, 
  DocumentIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];

const UploadProof = () => {
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      error('Unsupported file format. Please upload a JPEG, PNG, or PDF.');
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      error('File exceeds the 5MB size limit.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    processSelectedFile(selectedFile);
  };

  const processSelectedFile = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(''); // Clear preview for PDF
      }
    }
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      error('Please select or drop a proof file first.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const duration = 1500; // 1.5s total upload time simulation
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setUploading(false);
            success('Proof document verified and uploaded successfully!');
            // Pass file and notes over to the submit page via route state
            navigate('/csr-submissions', { 
              state: { 
                proofFile: file, 
                proofPreview: file.type.startsWith('image/') ? previewUrl : null,
                notes: notes 
              } 
            });
          }, 300);
          return 100;
        }
        return Math.min(prevProgress + step, 100);
      });
    }, intervalTime);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 text-xs font-semibold cursor-pointer mb-2"
          >
            <ArrowLeftIcon className="h-3 w-3" /> Back
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Upload Sustainability Proof</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log green activity with authentic receipts, transport tickets, or photographs.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Drag & Drop Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Proof Attachment File</label>
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all duration-150 text-center min-h-[220px] ${
                    isDragActive 
                      ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/10' 
                      : 'border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={ALLOWED_TYPES.join(',')}
                  />
                  <DocumentArrowUpIcon className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Drag and drop file here, or <span className="text-brand-600 hover:underline">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    Supports JPEG, PNG, WEBP or PDF (Max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 bg-slate-50/30 dark:bg-slate-900/30 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex-shrink-0">
                        <DocumentIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-xs sm:max-w-sm">{file.name}</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    
                    {!uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl"
                        iconLeft={<TrashIcon className="h-4 w-4" />}
                      />
                    )}
                  </div>

                  {/* Attachment Preview Box */}
                  <div className="flex justify-center bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden p-2 min-h-[140px] items-center">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Uploaded file preview" 
                        className="max-h-60 object-contain rounded-xl max-w-full"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <span className="text-4xl block">📄</span>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">PDF Document Attached</p>
                        <p className="text-[10px] text-slate-400">PDF preview is supported via downloading. Document is ready to submit.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress loader overlay */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>Uploading proof data...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-600 dark:bg-brand-500 transition-all duration-75"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Context / Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Context Notes / Comments</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bus fare ticket scan verifying public transport commute to office during Zero Waste Challenge (Week 1)"
              rows={3}
              disabled={uploading}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={uploading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={uploading}
              disabled={!file || uploading}
              className="px-6 cursor-pointer"
            >
              Upload and Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadProof;
