import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const UploadProof = () => {
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      error('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      success('Proof file uploaded successfully! Proceed to fill details.');
      navigate('/csr-submissions');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Upload Activity Proof</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload receipt scans, transport logs, photos of green activities, or certification files.
        </p>
      </div>

      <Card>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Select File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-950/20 dark:file:text-brand-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Activity Notes / Context</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bus fare receipt for eco-friendly work commute (Week 2)"
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="cursor-pointer">
              Go Back
            </Button>
            <Button type="submit" size="sm" loading={uploading} className="cursor-pointer">
              Upload and Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadProof;
