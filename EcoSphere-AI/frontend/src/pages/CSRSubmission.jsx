import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';
import csrService from '../services/csrService';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  InformationCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];

const CSRSubmission = () => {
  const { success, error } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    activityDate: '',
  });

  // Proof upload state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pre-populate if redirected from UploadProof.jsx
  useEffect(() => {
    if (location.state) {
      const { proofFile, proofPreview, notes } = location.state;
      if (proofFile) {
        setFile(proofFile);
        if (proofPreview) {
          setPreviewUrl(proofPreview);
        } else if (proofFile.type.startsWith('image/')) {
          setPreviewUrl(URL.createObjectURL(proofFile));
        }
      }
      if (notes) {
        setForm(prev => ({ ...prev, description: notes }));
      }
      // Clean up location state to avoid re-populating if refreshed
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const categories = [
    { id: 'Energy', name: 'Energy Efficiency (electricity, solar, heating)' },
    { id: 'Waste', name: 'Waste Reduction & Recycling' },
    { id: 'Transport', name: 'Sustainable Transportation & Commute' },
    { id: 'Conservation', name: 'Water & Resource Conservation' },
    { id: 'Community', name: 'Community Volunteering & Engagement' },
  ];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Drag & drop validation
  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      error('Unsupported file type. Please upload JPEG, PNG, or PDF.');
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      error('File size exceeds the 5MB limit.');
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
      setUploading(true);
      setUploadProgress(0);

      // Simulate a local file upload progress bar
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            success('Attachment loaded successfully!');
            return 100;
          }
          return prev + 20;
        });
      }, 100);

      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl('');
      }
    }
  };

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

  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location || !form.activityDate) {
      error('Please complete all required fields.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('location', form.location);
      formData.append('activityDate', form.activityDate);
      if (file) {
        formData.append('proofImage', file);
      }

      await csrService.submitActivityReport(formData);
      success('ESG Activity submitted successfully for evaluation!');
      
      // Reset form fields
      handleResetForm();
      
      // Redirect back to dashboard
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      if (import.meta.env.DEV) {
        // Fallback for local testing when backend is not running
        console.warn('Development Mode: Backend submit activity offline. Simulating success.');
        success('ESG Activity submitted successfully (dev simulation)!');
        handleResetForm();
        setTimeout(() => navigate('/'), 1000);
      } else {
        error(err.message || 'Failed to submit ESG activity report.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setForm({
      title: '',
      description: '',
      category: '',
      location: '',
      activityDate: '',
    });
    removeFile();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Submit Corporate ESG Action</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Document your sustainability initiatives to claim Eco Points. Your submission will be evaluated by department managers.
        </p>
      </div>

      <Card>
        <form onSubmit={handleOpenConfirmation} className="space-y-5">
          {/* Activity Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Activity Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleTextChange}
              placeholder="e.g. Organized electronic waste drive for department"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5 text-slate-400" /> Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleTextChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden dark:bg-slate-900 cursor-pointer"
                required
              >
                <option value="" disabled className="text-slate-500">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-850 dark:text-slate-100">{c.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPinIcon className="h-3.5 w-3.5 text-slate-400" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleTextChange}
                placeholder="e.g. HQ Office, remote, field site"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Activity Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400" /> Date Completed
            </label>
            <input
              type="date"
              name="activityDate"
              value={form.activityDate}
              onChange={handleTextChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden dark:bg-slate-900"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Activity Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleTextChange}
              placeholder="Detail the actions you performed, the goals reached, and the estimated carbon offset..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Attachment upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Documentary Proof (Optional Image/PDF)</label>
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-150 text-center ${
                    isDragActive 
                      ? 'border-brand-500 bg-brand-50/20' 
                      : 'border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={ALLOWED_TYPES.join(',')}
                  />
                  <CloudArrowUpIcon className="h-8 w-8 text-slate-400 mb-2 animate-bounce-subtle" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Drag and drop file here, or <span className="text-brand-600 hover:underline">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Supports JPEG, PNG, WEBP or PDF (Max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/20 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <DocumentIcon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-xs">{file.name}</span>
                    </div>
                    {!uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg"
                        iconLeft={<TrashIcon className="h-4 w-4" />}
                      />
                    )}
                  </div>

                  {uploading && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 transition-all duration-75" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {previewUrl && !uploading && (
                    <div className="flex justify-center bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl overflow-hidden p-1 max-h-48">
                      <img src={previewUrl} alt="Preview" className="max-h-44 object-contain rounded-lg" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={handleResetForm}
              disabled={submitting}
              className="text-xs cursor-pointer"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              loading={submitting}
              disabled={uploading}
              className="px-6 cursor-pointer"
            >
              Submit ESG Activity
            </Button>
          </div>
        </form>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm ESG Submission"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmSubmit} loading={submitting}>
              Confirm and Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-xl text-xs leading-normal">
            <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <p>
              Please make sure that the activity details are complete and truthful. False submissions are subject to review and penalty.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-slate-400">Activity Title</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{form.title}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-slate-400">Category</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{form.category}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-slate-400">Location</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{form.location}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-slate-400">Date Completed</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{form.activityDate}</span>
            </div>
            {file && (
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-slate-400">Attachment</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">✓ {file.name}</span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CSRSubmission;
