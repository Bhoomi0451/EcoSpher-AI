import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';
import csrService from '../services/csrService';

const CSRSubmission = () => {
  const { success, error } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    activityDate: '',
  });
  const [file, setFile] = useState(null);

  const categories = [
    { id: 'energy', name: 'Energy Efficiency (electricity, solar, heating)' },
    { id: 'waste', name: 'Waste Reduction & Recycling' },
    { id: 'transport', name: 'Sustainable Transportation & Commute' },
    { id: 'conservation', name: 'Water & Resource Conservation' },
    { id: 'community', name: 'Community Volunteering & Engagement' },
  ];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.activityDate) {
      error('Please complete all form fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('activityDate', form.activityDate);
      if (file) {
        formData.append('proofImage', file);
      }

      await csrService.submitActivityReport(formData);
      success('ESG Activity submitted successfully for evaluation!');
      setForm({
        title: '',
        description: '',
        category: '',
        activityDate: '',
      });
      setFile(null);
    } catch (err) {
      error(err.message || 'Failed to submit ESG activity report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Submit Corporate ESG Proof</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Document your green initiatives to claim Eco Points. Your submissions will be reviewed by department managers.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Activity Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleTextChange}
              placeholder="e.g. Organized electronic waste drive for department"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>

          {/* Category selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">ESG Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleTextChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:bg-slate-900 cursor-pointer"
              required
            >
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Activity Date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date Completed</label>
            <input
              type="date"
              name="activityDate"
              value={form.activityDate}
              onChange={handleTextChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:bg-slate-900"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleTextChange}
              placeholder="Detail the activity completed and the estimated environmental impact..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>

          {/* Attachment upload */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Documentary Proof (Optional Image/PDF)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-2xl mb-2">📁</span>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {file ? file.name : 'Click to upload proof file'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    JPEG, PNG, or PDF up to 5MB
                  </p>
                </div>
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <Button type="submit" loading={submitting} className="px-6 cursor-pointer">
              Submit ESG Activity
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CSRSubmission;
